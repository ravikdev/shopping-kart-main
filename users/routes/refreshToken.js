const express = require('express');
const jwt = require('jsonwebtoken');
const UserToken = require('../models/UserToken');
const { refreshTokenValidation } = require('../validation');
const { verifyRefreshToken } = require('../tokensFunc/verifyRefreshToken');

const router = express.Router();

// Generate a new access token using the refresh token
// router.post('/generate-token', async (req, res) => {
//     try {
//         const { error } = refreshTokenValidation(req.body);
//         if (error) return res.status(400).json({ message: error.details[0].message, status: false });

//         verifyRefreshToken(req.body.refreshToken)
//             .then(({ tokenDetails }) => {
//                 console.log('Refresh token verified successfully:', tokenDetails); //ank
//                 const payload = { _id: tokenDetails._id };
//                 const accessToken = jwt.sign(
//                     payload,
//                     process.env.ACCESS_PRIVATE_KEY,
//                     { expiresIn: "1h" }
//                 );
//                 res.status(200).json({
//                     accessToken,
//                     message: "Access token created successfully",
//                     status: true
//                 });
//             })
//             .catch((error) => res.status(400).json({
//                 error,
//                 status: false
//             }));
//     } catch (err) {
//         res.status(500).json({
//             status: false,
//             message: "Internal Server Error"
//         });
//     }
// });

router.post('/generate-token', async (req, res) => {
    try {
        // Validate input
        const { error } = refreshTokenValidation(req.body);
        if (error) {
            const errorDetails = {
                message: error.details[0]?.message || 'Invalid input',
                type: 'Validation Error',
                method: req.method,
                route: req.originalUrl,
                field: error.details[0]?.path[0], // Field causing the error
                timestamp: new Date().toISOString()
            };

            console.error("Validation Error:", errorDetails); // Log validation error

            return res.status(400).json({
                status: false,
                errorDetails
            });
        }

        // Verify the refresh token
        try {
            const { tokenDetails } = await verifyRefreshToken(req.body.refreshToken);

            console.log('Refresh token verified successfully:', tokenDetails); // Log token details

            const payload = { _id: tokenDetails._id };
            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_PRIVATE_KEY,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                accessToken,
                message: "Access token created successfully",
                status: true
            });
        } catch (verificationError) {
            const errorDetails = {
                message: verificationError.message || 'Refresh token verification failed',
                type: 'Token Verification Error',
                method: req.method,
                route: req.originalUrl,
                timestamp: new Date().toISOString()
            };

            console.error("Token Verification Error:", errorDetails); // Log token verification error

            return res.status(400).json({
                status: false,
                errorDetails
            });
        }
    } catch (err) {
        const errorDetails = {
            message: err.message || 'Internal Server Error',
            type: 'Unexpected Error',
            method: req.method,
            route: req.originalUrl,
            timestamp: new Date().toISOString()
        };

        console.error("Unexpected Error:", errorDetails); // Log unexpected error

        return res.status(500).json({
            status: false,
            errorDetails
        });
    }
});

// Logout
router.delete('/logout', async (req, res) => {
    try {
        const { error } = refreshTokenValidation(req.body);
        if (error)
            return res.status(400).json({
                status: false,
                message: error.details[0].message
            });

        const userToken = await UserToken.findOne({ where: { token: req.body.refreshToken } });
        if (!userToken)
            return res.status(200).json({
                status: true,
                message: "Logged Out Successfully"
            });

        await userToken.destroy();
        res.status(200).json({
            status: true,
            message: "Logged Out Successfully"
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
});

module.exports = router;
