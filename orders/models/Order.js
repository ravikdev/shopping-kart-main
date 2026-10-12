const { DataTypes, JSONB } = require('sequelize');
const sequelize = require('../config');

const Order = sequelize.define('order', {
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactNo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },

    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    products: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now
    }
}, { timestamps: true })


module.exports = Order;

