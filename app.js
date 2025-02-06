const connectDB = require('./config/db'); 

const express = require('express');
require('dotenv').config();

const userroutes = require('./routes/userRoutes')
const sellerroutes = require('./routes/sellerRoutes')

const app = express();
app.use(express.json());

// call this function for connection
connectDB();
app.get("/",(req,res)=>{
    res.send("Hello World by sahil  ");
})
app.use('/api',userroutes);
app.use('/api',sellerroutes);
app.listen(3001,()=>{
    console.log("server is running")
})
