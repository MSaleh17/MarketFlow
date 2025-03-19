const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db");

const CartItem = sequelize.define("CartItem", {
  cartId: {
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
  }
});

module.exports = CartItem;
