
const axios = require("axios");
// const env = require("dotenv").config();
// const passport = require('passport');
// const newrelic = require("newrelic");
const SERVICE = "products";

const newRelicWrapper = (handler) => {
  return async (req, res) => {
    const errorCode = req.headers["error-code"];
    const errorService = req.headers["error-service"];
    if (errorCode && errorService && errorService == SERVICE) {
      handleCustomError(errorCode, res);
      return;
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.error("Unhandled Error:", error.stack);
      // newrelic.noticeError(error, { stack: error.stack });
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };
};

const handleCustomError = async (errorCode, res) => {
  try {
    switch (errorCode) {
      case "501":
        throw new Error("501 Error: Not Implemented");
      case "502":
        await simulateUpstreamServiceFailure();
        break;
      case "503":
        simulateServerOverload();
        break;
      default:
        throw new Error(`Unknown Error Code: ${errorCode}`);
    }
  } catch (error) {
    console.error(error.stack);
    // newrelic.noticeError(error, { stack: error.stack });
    const statusCode = parseInt(errorCode, 10) || 400;
    res.status(statusCode).json({ message: error.message, error: error.stack });
  }
};

const simulateUpstreamServiceFailure = async () => {
  try {
    await axios.get("https://nonexistent-url.fakeapi.com");
  } catch (error) {
    throw new Error("502 Error: Bad Gateway");
  }
};

const simulateServerOverload = () => {
  // Simulate server overload by throwing an error
  throw new Error("503 Error: Service Unavailable");
};

module.exports = {
  newRelicWrapper,
};
