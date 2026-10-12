const router = require('express').Router();
const { addToCart, deleteCartItem, getCartItems, updateCart, deleteAllCartItems } = require('../controllers/cart');
const authenticateMiddleware = require('../middleware');
const winstonLogger = require('../logger');
router.post('/add-cart', authenticateMiddleware, addToCart);

router.delete('/delete-cart', authenticateMiddleware, deleteCartItem);

router.post('/get-cart', authenticateMiddleware, getCartItems);

router.patch('/update-cart', authenticateMiddleware, updateCart)

router.post('/delete-all-cart', deleteAllCartItems);


//error route

// for 501 error
// router.post('/add-cart', authenticateMiddleware, addToCart, (req, res) => {
//     const errorMessage = '501 Not Implemented - Add to cart functionality is not implemented';
//     winstonLogger.error(errorMessage);
//     res.status(501).send(errorMessage);
//   });

// //for 503 error
// router.get('/delete-all-cart',deleteAllCartItems, (req, res) => {
//     const errorMessage = '503 Service Unavailable - Delete to cart functionality is not available';
//     winstonLogger.error(errorMessage);
//     res.status(503).send(errorMessage);
//   });
//    res.status(503).send('503 Service Unavailable');
 

//for refeernce error
router.get("/error", (req, res) => {
    res.send(data)
})

//error
router.get("/error2", (req, res) => {
    res.send("data")
})

router.get("/error3", (req, res) => {
    const errorData = {
        message: "An internal error has occurred. Please try again later",
        errorCode: 500 
    };
    winstonLogger.error(`Error ${errorData.errorCode}: ${errorData.message}`);
    res.status(errorData.errorCode).send(errorData);
});



module.exports = router;