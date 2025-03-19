const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db");

const OrderItem = sequelize.define("OrderItem", {
  orderId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  productTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  }
});

module.exports = OrderItem;
