const express = require('express');
const helmet = require("helmet");
const port = process.env.PORT || 8003;
// const dotenv = require('dotenv').config();
const cors = require('cors');
const sequelize = require('./config');
const winston = require('winston');
// const { OpenTelemetryTransport } = require('@opentelemetry/winston');


const logFormat = () => {
    return winston.format.printf(function (info) {
      return `${new Date().toISOString()}-${info.level}: ${info.secondary ? info.message + ' - ' : ''} ${JSON.stringify(info.message, null, 4)}`;
    });
  };

// const winstonLogger = winston.createLogger({
// level: 'info',
//     format: winston.format.json(),
//     // defaultMeta: { service: 'user-service' },
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
// console.log = function() {
//     winstonLogger.info.apply(winstonLogger, arguments);
// };

// console.error = function() {
//     winstonLogger.error.apply(winstonLogger, arguments);
// };

// console.trace = function() {
//     winstonLogger.debug.apply(winstonLogger, arguments);
// };


winstonLogger.log({ level: 'info',format: winston.format.cli()});


// import routes
const authRoutes = require('./routes/auth');
const refreshTokenRoutes = require('./routes/refreshToken');

// create an express app
const app = express();

app.use(helmet());   // helmet in our express framework and hide away sensitive information. like (X-Powered-By: Express).

// Allow CORS from all origins and IPs
app.use(cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'traceparent', 'tracestate', 'baggage']
}));

//set custom headers
// app.use(function (req, res, next) {
//     res.setHeader(
//         "Access-Control-Allow-Headers", ["newrelic", "traceparent", "tracestate"]
//     );
//     return next();
// });

sequelize.sync()
    .then(() => console.log('Connected to the database!'))
    .catch((error) => console.error('Error connecting to the database:', error));

app.use(express.json());

app.use('/users', authRoutes);
app.use('/users', refreshTokenRoutes);
//app.use('/api/v1', routes);//501

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// listen to the port 
app.listen(port, (error) => {
    if (error) {
        console.log(`Problem in running the server, ${error}`)
    }

    console.log(`Server is listening on port : ${port}`)
})



// console.log("This is a console.log message");
// console.error("This is a console.error message");
// console.trace("This is a console.trace message");
// console.debug("This is a console.debug message");
