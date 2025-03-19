const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db");

const Cart = sequelize.define("Cart", {
  cartId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  total: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false,
    validate: {
      min: 0.0
    }
  }
});

module.exports = Cart;
