const express = require('express');
const cors = require('cors');
require('dotenv').config();
const expressSession = require('express-session')

const sequelize = require('./config/database');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const backupRoutes = require('./routes/backupRoutes');

const { stockCheckerCronJob } = require('./jobs/stockCheckerCronJob');

stockCheckerCronJob();

const app = express();
const port = process.env.PORT || 5000;

app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true } // Set to true if using HTTPS
}));

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static('uploads'));
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', backupRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(port, () => console.log(`Server running on port ${port}`));
});