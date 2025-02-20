const express = require('express');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const inventoryPurchaseController = require('../controllers/inventoryPurchaseController');

const router = express.Router();

router.post('/inventory-purchase', authenticateJWT, authorizeRole(true), inventoryPurchaseController.createInventoryPurchase);
router.get('/inventory-purchase', inventoryPurchaseController.getAllInventoryPurchases);

module.exports = router;
