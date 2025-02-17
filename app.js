const connectDB = require('./config/db'); 

const express = require('express');
require('dotenv').config();

const userroutes = require('./routes/userRoutes')
const sellerroutes = require('./routes/sellerRoutes')
const productroutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')


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

const port = process.env.PORT || 3000; // Example: Using environment variable or default to 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});