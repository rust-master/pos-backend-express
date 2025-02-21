const PdfPrinter = require('pdfmake');

// Define common fonts
const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};

// Common styles
const styles = {
    dateStyle: {
        fontSize: 12,
        bold: false,
        margin: [0, 5, 0, 10]
    },
    header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
    },
    subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
    },
    subheaderProductSold: {
        fontSize: 14,
        bold: true,
        margin: [0, 20, 0, 5]
    }
};

const generateDailySalesPdf = (data) => {

    const printer = new PdfPrinter(fonts);

    const docDefinition = {
        content: [
            { text: 'Report Date: ' + new Date().toLocaleDateString(), style: 'dateStyle', alignment: 'right' },
            { text: 'Daily Sales Report', style: 'header', alignment: 'center' },
            { text: `Total Sales: $${data.totalSales.toFixed(2)}`, style: 'subheader' },
            { text: `Total Orders: ${data.totalOrders}`, style: 'subheader' },
            { text: 'Daily Sales Details:', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['10%', '13%', '17%', '20%', '11%', '15%', '15%'],
                    body: [
                        [
                            { text: 'Date', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Phone', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Quantity', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Price at Time', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales', bold: true, fillColor: '#eeeeee', alignment: 'center' }
                        ],
                        ...data.dailySales.flatMap((sale, index) =>
                            sale.OrderItems.map(item => [
                                { text: sale.get('date'), alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerPhone, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.Product.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.quantity, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `$${item.priceAtTime.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `$${sale.get('totalSales').toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ])
                        )
                    ]
                }
            },
            { text: 'Total Products Sold:', style: 'subheaderProductSold', },
            {
                table: {
                    headerRows: 1,
                    widths: ['40%', '30%', '30%'],
                    body: [
                        [
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Quantity Sold', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales Amount', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                        ],
                        ...data.totalProductsSold.map((sold, index) => {
                            return [
                                { text: sold.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sold.totalQuantitySold, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `$${sold.totalSalesAmount.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ];
                        })
                    ]
                }
            },
        ],
        styles
    };

    return printer.createPdfKitDocument(docDefinition);
};

const generateWeeklySalesPdf = (data) => {

    const printer = new PdfPrinter(fonts);

    const docDefinition = {
        content: [
            { text: 'Report Date: ' + new Date().toLocaleDateString(), style: 'dateStyle', alignment: 'right' },
            { text: 'Weekly Sales Report', style: 'header', alignment: 'center' },
            { text: `Total Sales: $${data.totalSales.toFixed(2)}`, style: 'subheader' },
            { text: `Total Orders: ${data.totalOrders}`, style: 'subheader' },
            { text: 'Weekly Sales Details:', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['10%', '13%', '17%', '20%', '11%', '15%', '15%'],
                    body: [
                        [
                            { text: 'Week', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Phone', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Quantity', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Price at Time', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales', bold: true, fillColor: '#eeeeee', alignment: 'center' }
                        ],
                        ...data.weeklySales.flatMap((sale, index) =>
                            sale.OrderItems.map(item => [
                                { text: sale.get('week').toISOString().slice(0, 10), alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerPhone, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.Product.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.quantity, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `$${item.priceAtTime.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `$${sale.get('totalSales').toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ])
                        )
                    ]
                }
            },
            { text: 'Total Products Sold:', style: 'subheaderProductSold', },
            {
                table: {
                    headerRows: 1,
                    widths: ['40%', '30%', '30%'],
                    body: [
                        [
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Quantity Sold', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales Amount', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                        ],
                        ...data.totalProductsSold.map((sold, index) => {
                            return [
                                { text: sold.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sold.totalQuantitySold, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `$${sold.totalSalesAmount.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ];
                        })
                    ]
                }
            },
        ],
        styles
    };

    return printer.createPdfKitDocument(docDefinition);
};

const generateMonthlySalesPdf = (data) => {

    const printer = new PdfPrinter(fonts);

    const docDefinition = {
        content: [
            { text: 'Report Date: ' + new Date().toLocaleDateString(), style: 'dateStyle', alignment: 'right' },
            { text: 'Monthly Sales Report', style: 'header', alignment: 'center' },
            { text: `Total Sales: $${data.totalSales.toFixed(2)}`, style: 'subheader' },
            { text: `Total Orders: ${data.totalOrders}`, style: 'subheader' },
            { text: 'Monthly Sales Details:', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['10%', '13%', '17%', '20%', '11%', '15%', '15%'],
                    body: [
                        [
                            { text: 'Month', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Phone', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Quantity', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Price at Time', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales', bold: true, fillColor: '#eeeeee', alignment: 'center' }
                        ],
                        ...data.monthlySales.flatMap((sale, index) =>
                            sale.OrderItems.map(item => [
                                { text: sale.get('month').toISOString().slice(0, 7), alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null }, // Zebra striping
                                { text: sale.customerName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerPhone, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.Product.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.quantity, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `$${item.priceAtTime.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `$${sale.get('totalSales').toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ])
                        )
                    ]
                }
            },
            { text: 'Total Products Sold:', style: 'subheaderProductSold', },
            {
                table: {
                    headerRows: 1,
                    widths: ['40%', '30%', '30%'],
                    body: [
                        [
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Quantity Sold', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales Amount', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                        ],
                        ...data.totalProductsSold.map((sold, index) => {
                            return [
                                { text: sold.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sold.totalQuantitySold, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `$${sold.totalSalesAmount.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ];
                        })
                    ]
                }
            },
        ],
        styles
    };

    return printer.createPdfKitDocument(docDefinition);
};

const generateCustomPdf = (data) => {

    const printer = new PdfPrinter(fonts);

    const docDefinition = {
        content: [
            { text: 'Report Date: ' + new Date().toLocaleDateString(), style: 'dateStyle', alignment: 'right' },
            { text: 'Custom Sales Report', style: 'header', alignment: 'center' },
            { text: `From ${data.startDate.toDateString()} to ${data.endDate.toDateString()}`, style: 'subheader' },
            { text: `Total Sales: $${data.totalSales.toFixed(2)}`, style: 'subheader' },
            { text: `Total Orders: ${data.totalOrders}`, style: 'subheader' },
            { text: 'Sales and Order Details:', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['10%', '13%', '17%', '20%', '11%', '15%', '15%'], // Dynamic widths
                    body: [
                        [
                            { text: 'Date', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Phone', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Quantity', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Price at Time', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales', bold: true, fillColor: '#eeeeee', alignment: 'center' }
                        ],
                        ...data.customSales.flatMap((sale, index) =>
                            sale.OrderItems.map(item => [
                                { text: sale.get('date'), alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null }, // Zebra striping
                                { text: sale.customerName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerPhone, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.Product.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.quantity, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `$${item.priceAtTime.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `$${sale.get('totalSales').toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null }
                            ])
                        )
                    ]
                },
                layout: {
                    fillColor: (rowIndex) => (rowIndex === 0 ? '#eeeeee' : null) // Ensures header row has background color
                }
            },
            { text: 'Total Products Sold:', style: 'subheaderProductSold', },
            {
                table: {
                    headerRows: 1,
                    widths: ['40%', '30%', '30%'],
                    body: [
                        [
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Quantity Sold', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales Amount', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                        ],
                        ...data.totalProductsSold.map((sold, index) => {
                            return [
                                { text: sold.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sold.totalQuantitySold, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `$${sold.totalSalesAmount.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ];
                        })
                    ]
                }
            },
        ],
        styles
    };

    return printer.createPdfKitDocument(docDefinition);
};

module.exports = {
    generateCustomPdf,
    generateMonthlySalesPdf,
    generateWeeklySalesPdf,
    generateDailySalesPdf
}