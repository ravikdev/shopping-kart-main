const axios = require('axios');
const env = require('dotenv').config();

const validateToken = async (token) => {
    try {
        const response = await axios.post(`${process.env.USER_RESPONSE}/users/validate-token`, { token });
        const { authenticated } = response.data;

        return authenticated;
    } catch (error) {
        console.error('Token validation error:', error.message);
        throw new Error('Token validation failed');
    }
};

const authenticateMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {

        const token = authHeader.replace(/^Bearer\s/, '');

        try {
            const isAuthenticated = await validateToken(token);

            if (isAuthenticated) {
                next();
            } else {
                return res.status(403).json({
                    authenticated: false,
                    message: 'User authentication failed'
                });
            }
        } catch (error) {
            console.error('Internal server error:', error.message);
            return res.status(500).json({
                authenticated: false,
                message: 'Internal server error'
            });
        }
    } else {
        return res.status(401).json({
            authenticated: false,
            message: 'You are not authenticated'
        });
    }
};

module.exports = authenticateMiddleware;
