const { DataTypes } = require("sequelize");
const sequelize = require('../config');

const User = sequelize.define('user', {
   email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
   },
   password: {
      type: DataTypes.STRING,
      allowNull: false
   },
   firstName: {
      type: DataTypes.STRING,
      allowNull: false
   },
   lastName: {
      type: DataTypes.STRING,
      allowNull: false
   },
   contactNo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "9889998888",
   }
}, { timestamps: true })

module.exports = User;

