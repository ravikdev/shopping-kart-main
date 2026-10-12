// const bodyParser = require('body-parser');
const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
// require('dotenv').config();
const app = express();

const winston = require('winston');

const logFormat = () => {
    return winston.format.printf(function (info) {
      return `${new Date().toISOString()}-${info.level}: ${info.secondary ? info.message + ' - ' : ''} ${JSON.stringify(info.message, null, 4)}`;
    });
  };


const winstonLogger = winston.createLogger({
  level: 'info',

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),

//   defaultMeta: { service: 'user-service' },

  transports: [

    // Console transport (for Docker logs)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat()
      )
    }),

    // OpenTelemetry transport (THIS SENDS LOGS TO OTEL)
    // new OpenTelemetryTransport()

  ],
});
// const winstonLogger = winston.createLogger({
// level: 'info',
//     format: winston.format.json(),
//     defaultMeta: { service: 'product-service' },
//     transports: [
//         new winston.transports.Console({
//             format: winston.format.combine(
//               winston.format.errors({ stack: true }),
//               winston.format.colorize(),
//               winston.format.json({ maximumDepth: 1 }),
//               logFormat()
//             )
//           })
//     ],
// });

console.log = (...args) => {
  winstonLogger.info(args.length === 1 ? args[0] : args);
};

console.error = (...args) => {
  winstonLogger.error(args.length === 1 ? args[0] : args);
};

console.warn = (...args) => {
  winstonLogger.warn(args.length === 1 ? args[0] : args);
};

console.debug = (...args) => {
  winstonLogger.debug(args.length === 1 ? args[0] : args);
};

console.trace = (...args) => {
  winstonLogger.debug(args.length === 1 ? args[0] : args);
};
// console.log = function() {
//     winstonLogger.info.apply(winstonLogger, arguments);
// };

// console.error = function() {
//     winstonLogger.error.apply(winstonLogger, arguments);
// };

winstonLogger.log({ level: 'info',format: winston.format.cli()});



//middlewares
app.use(express.json())
app.use(helmet());   // helmet in our express framework and hide away sensitive information. like (X-Powered-By: Express).
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//set custom headers
app.use(function (req, res, next) {
    res.setHeader(
        "Access-Control-Allow-Headers", ["Content-Type", "traceparent", "tracestate", "baggage"]
    );
    return next();
});

app.use((req, res, next) => {
    console.log('User in session:', req.body);
    next();
});

//routers
const router = require('./routes/productRouter');
app.use('/products', router)
// app.use('/api/v1/products', router)

app.use('/Images', express.static('./Images'))

app.use(express.json());
//app.use('/api/v1', routes); //501

const PORT = process.env.PORT || 8004

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})