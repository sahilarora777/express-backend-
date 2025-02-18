require('dotenv').config();
const connectDB = require('./config/db');

const express = require('express');
const cors = require('cors');

const userroutes = require('./routes/userRoutes');
const sellerroutes = require('./routes/sellerRoutes');
const productroutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const PaymentRoutes = require('./routes/PaymentRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Debugging: Check if environment variables are loaded
console.log("MONGO_URI:", process.env.MONGO_URI); // This should print your MongoDB URI

// Connect to database
connectDB();

app.get("/", (req, res) => {
    res.send("Hello World by Sahil");
});

app.use('/api', userroutes);
app.use('/api', sellerroutes);
app.use('/api', productroutes);
app.use('/api', orderRoutes);
app.use('/api', PaymentRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
