const { DataTypes } = require('sequelize');
const sequelize = require('../config');
 
const Cart = sequelize.define('cart', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique : false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, { timestamps: true });
 
module.exports = Cart;