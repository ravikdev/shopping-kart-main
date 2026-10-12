// require("newrelic");
const express = require('express');
const helmet = require("helmet");
const port = process.env.PORT || 8002;
const sequelize = require('./config');
const cors = require('cors');
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
// const winstonLogger = winston.createLogger({
// level: 'info',
//     format: winston.format.json(),
//     defaultMeta: { service: 'orders-service' },
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

// console.log = function() {
//     winstonLogger.info.apply(winstonLogger, arguments);
// };

// console.error = function() {
//     winstonLogger.error.apply(winstonLogger, arguments);
// };

winstonLogger.log({ level: 'info',format: winston.format.cli()});


const orderRoutes = require('./routes/orders');

const app = express();

app.use(helmet());   // helmet in our express framework and hide away sensitive information. like (X-Powered-By: Express).
app.use(cors());
app.use(express.json());

//set custom headers
app.use(function (req, res, next) {
    res.setHeader(
        "Access-Control-Allow-Headers", ["Content-Type", "traceparent", "tracestate", "baggage"]
    );
    return next();
});

sequelize.sync()
    .then(() => console.log("Connected to database!"))
    .catch((error) => console.log(`Error in connecting to database ${error}`))

app.use('/orders', orderRoutes);

app.use(express.json());
//app.use('/api/v1', routes); //501


app.listen(port, (error) => {
    if (error) {
        console.log(`Problem in running the server ${error}`)
    }
    console.log(`Server is running on port : ${port}`)
})



