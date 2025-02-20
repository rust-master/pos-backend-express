const cron = require('node-cron');
const { backupDatabase } = require('../controllers/backupController');

const backupCronJob = () => {
    cron.schedule('* * * * *', async () => { // Runs every hour
        console.log('⏳ Starting database backup...');

        try {
            const result = await backupDatabase({}, { status: () => ({ json: () => {} }) }); // Mock req & res
            console.log(result);
            console.log('✅ Database backup completed successfully!');
        } catch (err) {
            console.error('❌ Error backup database:', err.message);
        }
    });
};

module.exports = { backupCronJob };
