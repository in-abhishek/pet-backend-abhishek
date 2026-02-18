const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.FRONTEND_BASE_URL
app.use(cors({
    origin: BASE_URL,
    credentials: true,

    
}));
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Server is running...');
});

// auth router
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

const petRoutes = require('./routes/petRoutes');
app.use('/api', petRoutes);

// add for adoption
const adoptionRoutes = require('./routes/adoptionRoutes');

app.use('/api', adoptionRoutes);


app.listen(PORT, () => {
    console.log(" Server is running ");
});