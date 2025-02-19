const { Op, fn, col, literal } = require('sequelize');
const Order = require('../models/Order');
const OrderItems = require('../models/OrderItems');
const Product = require('../models/Product');
const PdfPrinter = require('pdfmake');
const fs = require('fs');
const htmlPdf = require('html-pdf');
const { generateCustomPdf, generateMonthlySalesPdf, generateWeeklySalesPdf, generateDailySalesPdf } = require('../utils/pdfGenerator');

// 🗓️ Get Daily Sales Report (with Order Items & Product Info)
const getDailySales = async (req, res) => {
    try {
        const { download } = req.query;

        const dailySales = await Order.findAll({
            attributes: [
                [fn('DATE', col('Order.createdAt')), 'date'],  // Specify table name
                [fn('SUM', col('totalPrice')), 'totalSales'],
                [fn('COUNT', col('Order.id')), 'totalOrders'],
                'customerName',
                'customerPhone'
            ],
            where: {
                createdAt: {
                    [Op.gte]: literal('CURRENT_DATE')
                }
            },
            include: [
                {
                    model: OrderItems,
                    attributes: ['quantity', 'priceAtTime'],
                    include: [
                        {
                            model: Product,
                            attributes: ['productName', 'price', 'imageUrl']
                        }
                    ]
                }
            ],
            group: [
                'date',
                'Order.id',
                'OrderItems.id',
                'OrderItems->Product.id',
                'customerName',     // Add customerName to GROUP BY
                'customerPhone'     // Add customerPhone to GROUP BY
            ],
            order: [[literal('date'), 'DESC']]
        });

        const data = {
            totalSales: dailySales.reduce((sum, sale) => sum + (sale.get('totalSales') || 0), 0),  // Safely access totalSales
            totalOrders: dailySales.reduce((sum, sale) => sum + (parseFloat(sale.get('totalOrders')) || 0), 0),  // Safely access totalOrders
            dailySales: dailySales
        };

        // Check if the request is for a PDF download
        if (download === 'pdf') {
            // Generate PDF
            const pdfDoc = generateDailySalesPdf(data);

            // Set response headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=daily-sales-report.pdf`);

            // Stream the PDF to the client
            pdfDoc.pipe(res);
            pdfDoc.end();
        } else {
            // Return JSON response
            res.status(200).json({ message: '📊 Daily Sales Report', data: data });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 🗓️ Get Weekly Sales Report (with Order Items & Product Info)
const getWeeklySales = async (req, res) => {
    try {
        const { download } = req.query;

        const weeklySales = await Order.findAll({
            attributes: [
                [fn('DATE_TRUNC', 'week', col('Order.createdAt')), 'week'], // Specify table name
                [fn('SUM', col('totalPrice')), 'totalSales'],
                [fn('COUNT', col('Order.id')), 'totalOrders'],
                'customerName',
                'customerPhone'
            ],
            where: {
                createdAt: {
                    [Op.gte]: literal('CURRENT_DATE - INTERVAL \'7 days\'')
                }
            },
            include: [
                {
                    model: OrderItems,
                    attributes: ['quantity', 'priceAtTime'],
                    include: [
                        {
                            model: Product,
                            attributes: ['productName', 'price', 'imageUrl']
                        }
                    ]
                }
            ],
            group: [
                'week',
                'Order.id',         // Add Order.id to GROUP BY clause
                'OrderItems.id',
                'OrderItems->Product.id',
                'customerName',     // Add customerName to GROUP BY
                'customerPhone'     // Add customerPhone to GROUP BY
            ],
            order: [[literal('week'), 'DESC']]
        });

        const data = {
            totalSales: weeklySales.reduce((sum, sale) => sum + (sale.get('totalSales') || 0), 0),  // Safely access totalSales
            totalOrders: weeklySales.reduce((sum, sale) => sum + (parseFloat(sale.get('totalOrders')) || 0), 0),  // Safely access totalOrders
            weeklySales: weeklySales
        };

        // Check if the request is for a PDF download
        if (download === 'pdf') {
            // Generate PDF
            const pdfDoc = generateWeeklySalesPdf(data);

            // Set response headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=weekly-sales-report.pdf`);

            // Stream the PDF to the client
            pdfDoc.pipe(res);
            pdfDoc.end();
        } else {
            // Return JSON response
            res.status(200).json({ message: '📊 Weekly Sales Report', data: data });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 🗓️ Get Monthly Sales Report (with Customer Info, Order Items & Product Info)
const getMonthlySales = async (req, res) => {
    try {
        const { download } = req.query;

        const monthlySales = await Order.findAll({
            attributes: [
                [fn('DATE_TRUNC', 'month', col('Order.createdAt')), 'month'], // Specify table name
                [fn('SUM', col('totalPrice')), 'totalSales'],
                [fn('COUNT', col('Order.id')), 'totalOrders'],
                'customerName',  // Include customer name
                'customerPhone'  // Include customer phone
            ],
            where: {
                createdAt: {
                    [Op.gte]: literal('CURRENT_DATE - INTERVAL \'1 month\'')
                }
            },
            include: [
                {
                    model: OrderItems,
                    attributes: ['quantity', 'priceAtTime'],
                    include: [
                        {
                            model: Product,
                            attributes: ['productName', 'price', 'imageUrl']
                        }
                    ]
                }
            ],
            group: [
                'month',
                'Order.id',         // Add Order.id to GROUP BY clause
                'OrderItems.id',
                'OrderItems->Product.id',
                'customerName',     // Add customerName to GROUP BY
                'customerPhone'     // Add customerPhone to GROUP BY
            ],
            order: [[literal('month'), 'DESC']]
        });

        const data = {
            totalSales: monthlySales.reduce((sum, sale) => sum + (sale.get('totalSales') || 0), 0),  // Safely access totalSales
            totalOrders: monthlySales.reduce((sum, sale) => sum + (parseFloat(sale.get('totalOrders')) || 0), 0),  // Safely access totalOrders
            monthlySales: monthlySales
        };

        // Check if the request is for a PDF download
        if (download === 'pdf') {
            // Generate PDF
            const pdfDoc = generateMonthlySalesPdf(data);

            // Set response headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=monthly-sales-report.pdf`);

            // Stream the PDF to the client
            pdfDoc.pipe(res);
            pdfDoc.end();
        } else {
            // Return JSON response
            res.status(200).json({ message: '📊 Monthly Sales Report', data: data });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 📊 Get Custom Sales Report(From Date → To Date) (with Customer Info, Order Items & Product Info)
const getCustomSales = async (req, res) => {
    try {
        const { fromDate, toDate, download } = req.query;

        // 🛑 Validate input dates
        if (!fromDate || !toDate) {
            return res.status(400).json({ message: "⚠️ Both 'fromDate' and 'toDate' are required!" });
        }

        // Convert to Date objects and adjust `toDate` to end of the day (23:59:59.999)
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999); // Extend to end of the day

        // ⏳ Fetch orders within the updated date range
        const customSales = await Order.findAll({
            attributes: [
                [fn('DATE', col('Order.createdAt')), 'date'],
                [fn('SUM', col('totalPrice')), 'totalSales'],
                [fn('COUNT', col('Order.id')), 'totalOrders'],
                'customerName',  // Include customer name
                'customerPhone'  // Include customer phone
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: OrderItems,
                    attributes: ['quantity', 'priceAtTime'],
                    include: [
                        {
                            model: Product,
                            attributes: ['productName', 'price', 'imageUrl']
                        }
                    ]
                }
            ],
            group: [
                'date',
                'Order.id',         // Add Order.id to GROUP BY clause
                'OrderItems.id',
                'OrderItems->Product.id',
                'customerName',     // Add customerName to GROUP BY
                'customerPhone'     // Add customerPhone to GROUP BY
            ],
            order: [[literal('date'), 'DESC']]
        });

        const data = {
            startDate: startDate,
            endDate: endDate,
            totalSales: customSales.reduce((sum, sale) => sum + (sale.get('totalSales') || 0), 0),  // Safely access totalSales
            totalOrders: customSales.reduce((sum, sale) => sum + (parseFloat(sale.get('totalOrders')) || 0), 0),  // Safely access totalOrders
            customSales: customSales
        };

        // Check if the request is for a PDF download
        if (download === 'pdf') {
            // Generate PDF
            const pdfDoc = generateCustomPdf(data);

            // Set response headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=custom-sales-report-${startDate.toISOString()}-${endDate.toISOString()}.pdf`);

            // Stream the PDF to the client
            pdfDoc.pipe(res);
            pdfDoc.end();
        } else {
            // Return JSON response
            res.status(200).json({ message: '📊 Custom Sales Report', data: data });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



module.exports = { getDailySales, getWeeklySales, getMonthlySales, getCustomSales };
