const InventoryPurchase = require('../models/InventoryPurchase');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

const createInventoryPurchase = async (req, res) => {
    try {
        const { supplierId, products } = req.body;

        // Validate supplier exists
        const supplier = await Supplier.findByPk(supplierId);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        // Validate all products exist in the database
        const productIds = products.map(p => p.productId);
        const existingProducts = await Product.findAll({ where: { id: productIds } });

        if (existingProducts.length !== products.length) {
            return res.status(400).json({ message: "Some products do not exist in the database" });
        }

        // Calculate total quantity
        const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

        // Create inventory purchase
        const newPurchase = await InventoryPurchase.create({
            supplierId,
            products,
            totalQuantity
        });

        return res.status(201).json({ message: "Inventory purchase created successfully", data: newPurchase });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAllInventoryPurchases = async (req, res) => {
    try {
        const purchases = await InventoryPurchase.findAll({
            include: [
                { model: Supplier },

            ],

            // include: [
            //     { model: Supplier, attributes: ['id', 'supplierName', 'contactPerson', 'phone', 'email'] }
            // ]
        });



        // Fetch product details for each purchase
        const purchasesWithProducts = await Promise.all(purchases.map(async (purchase) => {
            if (!purchase.products || purchase.products.length === 0) {
                return { ...purchase.toJSON(), Products: [] };
            }

            const products = await Promise.all(purchase.products.map(async (product) => {
                const productDetails = await Product.findByPk(product.productId);
                return productDetails || { productId: product.productId, error: "Product not found" };
            }));

            return {
                ...purchase.toJSON(),
                ProductsDetail: products
            };
        }));

        return res.status(200).json({ message: "All purchases retrieved", data: purchasesWithProducts });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = {
    createInventoryPurchase,
    getAllInventoryPurchases
};