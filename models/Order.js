const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerPhone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Order;
