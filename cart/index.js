// require("newrelic");
const express = require('express');
const helmet = require("helmet");
const port = process.env.PORT || 8001;
// const dotenv = require('dotenv').config();
const cors = require('cors');
const winstonLogger = require('./logger');

winstonLogger.log = (...args) => {
  winstonLogger.info(args.length === 1 ? args[0] : args);
};

// winstonLogger.error = (...args) => {
//   winstonLogger.error(args.length === 1 ? args[0] : args);
// };

winstonLogger.warn = (...args) => {
  winstonLogger.warn(args.length === 1 ? args[0] : args);
};

winstonLogger.debug = (...args) => {
  winstonLogger.debug(args.length === 1 ? args[0] : args);
};

winstonLogger.trace = (...args) => {
  winstonLogger.debug(args.length === 1 ? args[0] : args);
};

// const logFormat = () => {
//     return winston.format.printf(function (info) {
//       return `${new Date().toISOString()}-${info.level}: ${info.secondary ? info.message + ' - ' : ''} ${JSON.stringify(info.message, null, 4)}`;
//     });
//   };

// const winstonLogger = winston.createLogger({
// level: 'info',
//     format: winston.format.json(),
//     defaultMeta: { service: 'cart-service' },
//     transports: [
//         new winston.transports.winstonLogger({
//             format: winston.format.combine(
//               winston.format.errors({ stack: true }),
//               winston.format.colorize(),
//               winston.format.json({ maximumDepth: 1 }),
//             //   logFormat()
//             )
//           })
//     ],
// });

// winstonLogger.log = function() {
//     winstonLogger.info.apply(winstonLogger, arguments);
// };

// winstonLogger.error = function() {
//     winstonLogger.error.apply(winstonLogger, arguments);
// };

// winstonLogger.log({ level: 'info',format: winston.format.cli()});



const sequelize = require('./config');

// import routes
const cartRoutes = require('./routes/cart');
const app = express();

//set custom headers
app.use(function (req, res, next) {
    res.setHeader(
        "Access-Control-Allow-Headers", ["Content-Type", "traceparent", "tracestate", "baggage"]
    );
    return next();
});

app.use(helmet());   // helmet in our express framework and hide away sensitive information. like (X-Powered-By: Express).
app.use(cors());
app.use(express.json());

app.use('/cart', cartRoutes,);
//app.use('/api/v1', routes);//501
sequelize.sync()
    .then(() => winstonLogger.log("Connected to the database!"))
    .catch((error) => winstonLogger.log(`Error in connecting to database: ${error}`))

app.listen(port, (err) => {
    if (err) {
        winstonLogger.log(`Problem in running the server ${err}`)
    }
    winstonLogger.log(`Server is running on port : ${port}`)
})

// module.exports = winstonLogger;