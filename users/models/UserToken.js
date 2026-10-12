const { DataTypes }  = require("sequelize");
const sequelize = require('../config');

const UserToken = sequelize.define('usertoken',{
    userId: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    token: {
        type: DataTypes.STRING,
        required: true
    }
}, {timestamps : true});

module.exports = UserToken;
