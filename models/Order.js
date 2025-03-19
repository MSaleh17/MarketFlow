const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db");

const Order = sequelize.define("Order", {
  orderId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER
  },
  total: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  }
});

module.exports = Order;
