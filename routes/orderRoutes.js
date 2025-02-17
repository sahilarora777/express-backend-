const express =  require("express");
const Order =  require("../models/Orders");
const Product = require("../models/Product");
const Seller =  require ("../models/Seller.js");
const authMiddleware = require("../middlewares/authmiddleware.js");

const router = express.Router();


router.post("/orders",authMiddleware,async (req,res)=>
    {
        try{
            console.log("req.user",req.user);
            
            const {items,paymentMethod,address} = req.body;
            let totalAmount = 0;
    
            for(const item of items)
            {
                const  product = await Product.findById(item.product);
                if(!product)
                {
                    return res.status(400).json ({message:"Product is not found"});
                } 
    
                item.price = product.price;
                item.seller = product.seller;
                totalAmount += item.quantity*item.price; 
            }
    
            const newOrder = new Order({
                customer: req.user.id, // This should now be populated
                items,
                totalAmount,
                paymentMethod,
                address,
                paymentStatus: paymentMethod === "online" ? "Paid" : "Pending",
            });
            
            
            await  newOrder.save();
            res.status(200).json({message:"Order succesfully placed",newOrder})
    
        }
        catch(error)
        {
            return res.status(500).json({message:"error aa gya",error});
        }
    });


module.exports = router;