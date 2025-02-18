const express = require("express");

const razorpay = require("../config/razorpay");

const Order = require("../models/Orders");

const router = express.Router();

router.post('/create-order',async(req,res)=>{
    try{
    const {amount,currency} = req.body;
    const options = {
        amount: amount * 100, // amount in smallest currency unit
        currency:currency || "INR",
        receipt: `order_rcpt_${Math.random()}`,
    }
     const order = await razorpay.orders.create(options);
     return res.status(200).json({message:"payment request generate  successfully",order});

    }catch(error){
        res.status(500).json({message:"Error creating order",error});
    }

})

module.exports = router;