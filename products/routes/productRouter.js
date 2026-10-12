const express = require("express");
const router = express.Router();
// const passport = require('passport');
// const newrelic = require("newrelic");

const productController = require("../controllers/productController");
const reviewController = require("../controllers/reviewControllers");
const categoryController = require("../controllers/categoryController");
const authenticateMiddleware = require("../middleware");
// const { newRelicWrapper } = require("../config/helperWrapper");

// GET /allProducts
// router.route('/').get(authenticateMiddleware, productController.getAllProducts);
router.route("/").get((req, res) => {
  // const delay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;


    productController.getAllProducts(req, res);

});

// GET /:id
router
  .route("/get-one-product/:id")
  .get(authenticateMiddleware, productController.getOneProduct);

// POST /addProduct
router
  .route("/add-product/:id")
  .post(
    authenticateMiddleware,
    productController.upload,
    productController.addProduct
  );

// GET /published
router
  .route("/published")
  .get(authenticateMiddleware, productController.getPublishedProduct);

// PUT /:id (to Updated)
router
  .route("/update-one/:id")
  .put(authenticateMiddleware, productController.updateProduct);

// DELETE /:id
router
  .route("/delete-one/:id")
  .delete(authenticateMiddleware, productController.deleteProduct);

// Category routes
router
  .route("/add-category")
  .post(authenticateMiddleware, categoryController.addCategory);
router
  .route("/all-categories")
  .get(authenticateMiddleware, categoryController.getAllCategories);
router
  .route("/update-category-one/:id")
  .put(authenticateMiddleware, categoryController.updateCategory);

// GET /getProductReviews/:id
router
  .route("/get-product-reviews/:id")
  .get(authenticateMiddleware, productController.getProductReviews);
router
  .route("/categories/:id")
  .get(authenticateMiddleware, productController.getCategoryProduct);

router
  .route("/add-review/:id")
  .post(authenticateMiddleware, reviewController.addReview);
router
  .route("/all-reviews")
  .get(authenticateMiddleware, reviewController.getAllReviews);

// product-id is present or not in db
router.route("/check/:productId").get(productController.getProductById);

router.get("/errors/501/not-defined", (req, res) => {
  try {
    missingFunction(); // This function is not defined, so it will throw an error
  } catch (error) {
    console.error(
      "501 Method not Defined: Missing Feature or Dependency on the Server"
    );

    // Additional tracking information
    const errorDetails = {
      status: 501,
      statusText: "Method Not Defined",
      message:
        "501 Method not Defined: Missing Feature or Dependency on the Server",
      route: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      headers: req.headers, // Include request headers for context
    };

    // Setting custom headers for additional context
    res.set({
      "X-Error-Info": "501 Method Not defined",
      "X-Request-Route": req.originalUrl,
      "X-Request-Method": req.method,
      "X-Timestamp": errorDetails.timestamp,
    });

    // Send structured error details in the response body
    res.status(501).json(errorDetails);
  }
});
router.get("/errors/501", (req, res) => {
  res
    .status(501)
    .send("501 Not Implemented ,Missing Feature or Dependency on the Server");
});
//for 503 error
router.get("/errors/503", (req, res) => {
  res
    .status(503)
    .send("503 Service Unavailable or this route is under maintenance");
});
//for refeernce error
router.get("/error", (req, res) => {
  res.send(data);
});

//error
// router.get("/error2", (req, res) => {
//     res.ssend("data")
// })
// router.get("/error2/type", (req, res) => {
//     const startTime = Date.now(); // Track start time for response time calculation

//     try {
//         // Intentional runtime error: calling a non-existent method
//         res.ssend("data"); // This will throw a SyntaxError

//     } catch (error) {
//         // Calculate response time
//         const responseTime = Date.now() - startTime;

//         // Log detailed error information
//         console.error(`Error occurred: ${error.message}`);

//         // Create an error details object
//         const errorDetails = {
//             message: error.message,
//             type: error instanceof SyntaxError ? "Type Error" : error instanceof TypeError ? "Syntax Error" : "Unknown Error",
//             method: req.method, // HTTP method
//             route: req.originalUrl, // Full route accessed
//             headers: req.headers, // Request headers
//             body: req.body, // Request body if available
//             stack: error.stack, // Stack trace for debugging
//             user: req.user ? { id: req.user.id, roles: req.user.roles } : null, // User info if available
//             responseTime: `${responseTime}ms`, // Time taken to process the request
//             environment: {
//                 nodeVersion: process.version, // Node.js version
//                 serverName: process.env.SERVER_NAME || "Local", // Custom server name from environment variable
//             },
//             timestamp: new Date().toISOString() // Current timestamp
//         };

//         // Log the error details for debugging
//         console.error("Error Details:", errorDetails);

//         // Send an error response to the client
//         res.status(400).send(errorDetails);
//     }
// });
router.get("/error2/type", (req, res) => {
  const startTime = Date.now(); // Track start time for response time calculation

  try {
    // Intentional runtime error: calling a non-existent method
    res.ssend("data"); // This will throw a SyntaxError
  } catch (error) {
    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Log detailed error information
    console.error(`Error occurred: ${error.message}`);

    // Create an error details object
    const errorDetails = {
      message: error.message,
      type:
        error instanceof SyntaxError
          ? "Type Error"
          : error instanceof TypeError
          ? "Syntax Error"
          : "Unknown Error",
      method: req.method, // HTTP method
      route: req.originalUrl, // Full route accessed
      headers: req.headers, // Request headers
      body: req.body, // Request body if available
      stack: error.stack, // Stack trace for debugging
      user: req.user ? { id: req.user.id, roles: req.user.roles } : null, // User info if available
      responseTime: `${responseTime}ms`, // Time taken to process the request
      environment: {
        nodeVersion: process.version, // Node.js version
        serverName: process.env.SERVER_NAME || "Local", // Custom server name from environment variable
      },
      timestamp: new Date().toISOString(), // Current timestamp
    };

    // Log the error details for debugging
    console.error("Error Details:", errorDetails);

    // Send a simplified error response to the client
    res.status(400).send({
      code: 400,
      status: "Type Error",
      errorDetails, // Send detailed error information separately
    });
  }
});

router.get("/error3", (req, res) => {
  const errorData = {
    message: "An internal error has occurred. Please try again later",
    // message: "An error occurred",
    errorCode: 500,
  };
  console.error(`Error ${errorData.errorCode}: ${errorData.message}`);
  res.status(errorData.errorCode).send(errorData);
});

router.get("/exception-error", (req, res) => {
  const startTime = Date.now(); // Track the start time for response time calculation

  try {
    // Trigger an exception by referencing an undefined variable
    let result = undefinedVariable + 1;
  } catch (error) {
    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Create an error details object
    const errorDetails = {
      message: error.message,
      type: "Exception Error",
      method: req.method, // HTTP method
      route: req.originalUrl, // Full route accessed
      headers: req.headers, // Request headers
      body: req.body, // Request body if available
      stack: error.stack, // Stack trace for debugging
      responseTime: `${responseTime}ms`, // Time taken to process the request
      environment: {
        nodeVersion: process.version, // Node.js version
        serverName: process.env.SERVER_NAME || "Local", // Custom server name from environment variable
      },
      timestamp: new Date().toISOString(), // Current timestamp
    };

    // Log the error details for debugging
    console.error("Error Details:", errorDetails);

    // Send the error details object in the response
    res.status(500).send({
      code: 500,
      status: "Undefined varaible error",
      errorDetails, // Include the detailed error information in the response
    });
  }
});

module.exports = router;
