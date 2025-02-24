const Product = require('../models/Product');
const Category = require('../models/Category');


// ✅ Create Product (Admin Only)
const createProduct = async (req, res) => {
    try {
        const { categoryId, productName, productDescription, price, quantity } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save image URL

        if (!categoryId) {
            return res.status(400).json({ message: "Invalid request: categoryId is required" });
        }
        if (!productName ||!productDescription ||!price ||!quantity) {
            return res.status(400).json({ message: "Invalid request: productName, productDescription, price, and quantity are required" });
        }

        // Validate category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const newProduct = await Product.create({ categoryId, productName, productDescription, price, quantity, imageUrl });
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Get All Products (Public)
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Get Product by ID (Public)
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, productName, productDescription, price, quantity } = req.body;
        
        // Find the product
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!categoryId) {
            return res.status(400).json({ message: "Invalid request: categoryId is required" });
        }
        if (!productName ||!productDescription ||!price ||!quantity) {
            return res.status(400).json({ message: "Invalid request: productName, productDescription, price, and quantity are required" });
        }

        // Validate category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Handle image URL if a new image is uploaded
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : product.imageUrl;

        // Update product details
        const updatedProduct = await product.update({
            categoryId,
            productName,
            productDescription,
            price,
            quantity,
            imageUrl
        });

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProductQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        console.log("🚀 ~ updateProductQuantity ~ quantity:", quantity);

        if (!quantity || isNaN(quantity)) {
            return res.status(400).json({ message: 'Invalid quantity value' });
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.quantity += quantity;

        await product.save();

        return res.status(200).json({ message: 'Product quantity updated successfully', product });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Delete Product (Admin Only)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    updateProductQuantity,
    deleteProduct
};
