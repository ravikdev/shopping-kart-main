const jwt = require('jsonwebtoken');
const UserToken = require('../models/UserToken');

const createTokens = async (user) => {
    try {
        const payload = { _id: user.id };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_PRIVATE_KEY,
            { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_PRIVATE_KEY,
            { expiresIn: "30d" }
        );

        const existingUserToken = await UserToken.findOne({ where: { userId: user.id } });
        if (existingUserToken) await existingUserToken.destroy();

        await UserToken.create({ userId: user.id, token: refreshToken });
        console.log("Success creating tokens for user:", user.id);
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error creating tokens:", error);
        throw error;
    }
};

module.exports.createTokens = createTokens;
