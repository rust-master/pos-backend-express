const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const Supplier = require('./Supplier');

const InventoryPurchase = sequelize.define('InventoryPurchase', {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true
    },
    supplierId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Supplier,
            key: 'id'
        }
    },
    products: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Products must be an array');
                }
            }
        }
    },
    totalQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    timestamps: true
});

// Define associations
Supplier.hasMany(InventoryPurchase, { foreignKey: 'supplierId', onDelete: 'CASCADE' });
InventoryPurchase.belongsTo(Supplier, { foreignKey: 'supplierId' });

module.exports = InventoryPurchase;
