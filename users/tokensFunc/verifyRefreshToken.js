const UserToken = require('../models/UserToken');
const jwt = require('jsonwebtoken');

const verifyRefreshToken = async (refreshToken) => {
    const key = process.env.REFRESH_PRIVATE_KEY;

    try {
        const data = await UserToken.findOne({
            where: { token: refreshToken }
        });
        if (!data) {
            throw { message: "Invalid refresh token" };
        }

        const tokenDetails = await jwt.verify(refreshToken, key);

        return {
            tokenDetails,
            message: "Valid refresh token",
        };
    } catch (err) {
        throw { message: "Invalid refresh token" };
    }
};

module.exports.verifyRefreshToken = verifyRefreshToken;
