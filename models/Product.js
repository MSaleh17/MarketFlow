const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db");

const Product = sequelize.define("Product", {
  productId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  reservedQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
  /*createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key : "userId"
    }
  }*/
});

module.exports = Product;
