const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db");

const User = sequelize.define("User", {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  role: {
    type: DataTypes.ENUM,
    values: ["customer", "admin"],
    defaultValue: "customer"
  },
  address: {
    type: DataTypes.INTEGER
  }
});

module.exports = User;
