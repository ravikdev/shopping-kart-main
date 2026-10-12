const router = require('express').Router();
const { getOrders, createOrders,triggerError501,triggerError502,triggerError503 } = require('../controllers/orders');
const authenticateMiddleware = require('../middleware');

router.post('/get-orders', authenticateMiddleware, getOrders)

router.post('/create-order', authenticateMiddleware, createOrders)
// router.post('/create-order', authenticateMiddleware, (req, res) => {
//     const delay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;

//     setTimeout(() => {
//         createOrders(req, res);
//     }, delay);
// });


// router.get('/trigger-error-501', triggerError501);
// router.get('/trigger-error-502', triggerError502);
// router.get('/trigger-error-503', triggerError503);


//for refeernce error
router.get("/error", (req, res) => {
    res.send(data)
})

router.get("/error2", (req, res) => {
    try {
        // Intentional syntax error: calling a non-existent method
        res.ssend("data"); // This will throw an error

    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error(`Syntax Error: ${error.message}`);
        } else {
            console.error(`Error: ${error.message}`);
        }

        // Send an error response to the client
        res.status(500).send({
            message: "An internal syntax error occurred.",
            type: "Syntax Error"
        });
    }
});


router.get("/error3", (req, res) => {
    const errorData = {
        message: "An internal error has occurred. Please try again later",
        errorCode: 501 
    };
    console.error(`Error ${errorData.errorCode}: ${errorData.message}`);
    res.status(errorData.errorCode).send(errorData);
});

router.get("/exception-error", (req, res) => {
    try {
        // Trigger an exception by referencing an undefined variable
        let result = undefinedVariable + 1;

    } catch (error) {
        // Log error details to the console
        console.error(`Exception Error: ${error.message}`);

        // Send the error message and type to the client
        res.status(500).send({
            message: error.message,
            type: "Exception Error"
        });
    }
});

module.exports = router;
