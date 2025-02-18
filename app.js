const connectDB = require('./config/db'); 

const express = require('express');

require('dotenv').config();

const userroutes = require('./routes/userRoutes')
const sellerroutes = require('./routes/sellerRoutes')
const productroutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const PaymentRoutes = require('./routes/PaymentRoutes')


const app = express();
app.use(express.json());

// call this function for connection
connectDB();
app.get("/",(req,res)=>{
    res.send("Hello World by sahil  ");
})
app.use('/api',userroutes);
app.use('/api',sellerroutes);
app.use('/api',productroutes);
app.use('/api',orderRoutes);
app.use('/api',PaymentRoutes);


const port = process.env.PORT || 8080; // Example: Using environment variable or default to 8080
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});