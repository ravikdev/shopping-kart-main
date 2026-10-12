import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";

// src/otel.ts
import {
 createSessionSpanProcessor,
  createSessionLogRecordProcessor,
  createDefaultSessionIdGenerator,
  createSessionManager,
  createLocalStorageSessionStore
} from '@opentelemetry/web-common';
import { diag, DiagConsoleLogger, DiagLogLevel, metrics } from "@opentelemetry/api";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

import { MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";

import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} from '@opentelemetry/sdk-logs';
// Enable diagnostic logging (set to WARN to reduce noise)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);
// session manager
const sessionManager = createSessionManager({
  sessionIdGenerator: createDefaultSessionIdGenerator(),
  sessionStore: new createLocalStorageSessionStore(),
  maxDuration: 7200,
  inactivityTimeout: 1800 
});

sessionManager.addObserver({
  onSessionStarted: (newSession, previousSession) => {
    console.log('Session started', newSession, previousSession);
  },
  onSessionEnded: (session) => {
    console.log('Session ended', session);
  }
});

// restore or start session
sessionManager.start();

// ----------------------------------------------------------------------
// Environment variables – configure these in your .env file or deployment
// ----------------------------------------------------------------------

// OTLP endpoint: the load balancer URL where the collector receives traces/metrics
// Example: "http://shoppingcart-lb-1985465652.us-east-1.elb.amazonaws.com:4318"
const OTLP_HTTP_BASE = import.meta.env.VITE_OTEL_OTLP_HTTP_BASE || "http://localhost:4318";

// Your backend API base URL (the service your frontend calls)
// Example: "http://backend-lb-1234567890.us-east-1.elb.amazonaws.com"
const BACKEND_API_BASE = import.meta.env.VITE_BACKEND_API_BASE || "http://localhost:8080";

// Validate required variables – if missing, telemetry will fail gracefully.
if (!OTLP_HTTP_BASE) {
  console.warn("VITE_OTEL_OTLP_HTTP_BASE is not set. Telemetry will not be sent.");
}
if (!BACKEND_API_BASE) {
  console.warn("VITE_BACKEND_API_BASE is not set. Trace headers will not be propagated to your backend.");
}

// ----------------------------------------------------------------------
// Resource attributes – identify this service in Coralogix
// ----------------------------------------------------------------------
const resource = resourceFromAttributes({
  [SemanticResourceAttributes.SERVICE_NAME]: "ceq-frontend-service",
  [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: "dev",
  // You can add custom attributes here if needed, e.g.:
  // "cx.application.name": "ShoppingCart",
  // "cx.subsystem.name": "Frontend",
});

// ----------------------------------------------------------------------
// Traces – export via OTLP HTTP to the collector
// ----------------------------------------------------------------------
let tracerProvider;

if (OTLP_HTTP_BASE) {
  const traceExporter = new OTLPTraceExporter({
    url: `${OTLP_HTTP_BASE}/v1/traces`,
  });

  tracerProvider = new WebTracerProvider({
    resource,
    spanProcessors: [new BatchSpanProcessor(traceExporter),createSessionSpanProcessor(sessionManager)],
  });

  tracerProvider.register();
}
const loggerProvider = new LoggerProvider({
  processors: [
    createSessionLogRecordProcessor(sessionManager),
    new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
  ]
});

const logger = loggerProvider.getLogger('example');
logger.emit({
    attributes: {
      name: 'my-event',
    },
    body: {
      key1: 'val1'
    }
  });
// ----------------------------------------------------------------------
// Metrics – export via OTLP HTTP to the collector
// ----------------------------------------------------------------------
let meterProvider;

if (OTLP_HTTP_BASE) {
  const metricExporter = new OTLPMetricExporter({
    url: `${OTLP_HTTP_BASE}/v1/metrics`,
  });

  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 10000, // export every 10 seconds
  });

  meterProvider = new MeterProvider({
    resource,
    readers: [metricReader],
  });

  metrics.setGlobalMeterProvider(meterProvider);
}

// ----------------------------------------------------------------------
// Instrumentations – auto‑capture browser interactions and propagate trace headers
// ----------------------------------------------------------------------

// Build list of URL patterns that should receive the traceparent header.
const propagatePatterns = [];

// Local development backend (keep as is)
propagatePatterns.push(/http:\/\/localhost:8000/i);
propagatePatterns.push(/http:\/\/a26c27d572e014ec28d563916fd11515-1430840935.us-east-1.elb.amazonaws.com:8000/i);
propagatePatterns.push(/https:\/\/a26c27d572e014ec28d563916fd11515-1430840935.us-east-1.elb.amazonaws.com:8000/i);

// Your production backend, if configured
if (BACKEND_API_BASE) {
  // Create a regex that matches the base URL with an optional port
  propagatePatterns.push(new RegExp(`^${BACKEND_API_BASE}(:\\d+)?`));
}

// Register all instrumentations (they will only be active if a tracer provider exists)
registerInstrumentations({
  instrumentations: [
    new DocumentLoadInstrumentation(),
    new UserInteractionInstrumentation(),
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: propagatePatterns,
      clearTimingResources: true,
    }),
    new XMLHttpRequestInstrumentation({
      propagateTraceHeaderCorsUrls: propagatePatterns,
    }),
  ],
});

// Export the meter provider if needed elsewhere (optional)
// import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent'

// Populate using values in copy-paste JavaScript snippet.

// const nr_cart_ip = import.meta.env.VITE_NR_CART_IP;
// const nr_prod_ip = import.meta.env.VITE_NR_PROD_IP;
// const nr_order_ip = import.meta.env.VITE_NR_ORDER_IP;
// const nr_users_ip = import.meta.env.VITE_NR_USERS_IP;

// const options = {
//   init: { distributed_tracing:{enabled:true,cors_use_newrelic_header:true,cors_use_tracecontext_headers:true,allowed_origins:[ nr_cart_ip, nr_order_ip, nr_prod_ip, nr_users_ip ]},privacy:{cookies_enabled:true},ajax:{deny_list:["bam.nr-data.net"]} }, // NREUM.init
//   info: { beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net",licenseKey:"NRJS-ffbec38761b38989cb3",applicationID:"1134406453",sa:1 }, // NREUM.info
//   loader_config: { accountID:"3884245",trustKey:"3692228",agentID:"1134406453",licenseKey:"NRJS-ffbec38761b38989cb3",applicationID:"1134406453" } // NREUM.loader_config
// }

// The agent loader code executes immediately on instantiation.
// new BrowserAgent(options)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
