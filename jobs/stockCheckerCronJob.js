const cron = require('node-cron');
const Product = require('../models/Product');
const { sendLowStockEmail } = require('../utils/emailService');
const { Op } = require('sequelize');

const stockCheckerCronJob = () => {
    cron.schedule('* * * * *', async () => { // Runs every hour
        console.log('🔍 Checking for low-stock products...');

        try {
            // Find products where quantity ≤ 5
            const lowStockProducts = await Product.findAll({
                where: {
                    quantity: { [Op.lte]: 100 }
                }
            });

            if (lowStockProducts.length > 0) {
                console.log('⚠️ Low Stock Products Found:', lowStockProducts);

                // 📧 Send an email notification to admins
                await sendLowStockEmail(lowStockProducts);
            } else {
                console.log('✅ No low-stock products found.');
            }
        } catch (err) {
            console.error('❌ Error checking stock:', err.message);
        }
    });
};

module.exports = { stockCheckerCronJob };
