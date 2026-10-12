const { Sequelize } = require('sequelize');
const env = require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        dialect : process.env.DIALECT,
        host : process.env.DB_HOST
    }
)

module.exports = sequelize;