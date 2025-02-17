const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true // Can be optional, in case no image is provided
    }
}, {
    timestamps: true
});

module.exports = Product;
