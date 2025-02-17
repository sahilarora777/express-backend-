const express = require('express');
const Seller = require("../models/Seller");
// const {sendEmail} = require("../config/emailConfig");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {generatedOTP} = require('../utils/sendOTP');

const router = express.Router();

// Create a route for POST Seller

router.post("/seller/verify-otp",async(req,res)=>{
try{
   const {otpToken,otp} = req.body;
   console.log("Received otpToken:", otpToken); 
   const decoded = jwt.verify(otpToken,process.env.JWT_SECRET);
    if(!decoded || decoded.otp !== otp){
         return res.status(400).json({message:"Invalid OTP or Token expired"});
    }
    const email = decoded.email;
    const user = await Seller.findOne({email});
    user.isEmailVerified = true;    
    await user.save();
    return res.status(200).json({message:"Seller verified successfully",user});
}catch(error){
    res.status(500).json({message:"Error verifying seller",error});
    console.log("error",error);
}

});


router.post("/seller/login", async (req, res) => {
try{
    const{email,password} = req.body;
    const seller = await Seller.findOne({email});
    if(!seller){
        return res.status(404).json({message:"Seller not found"});
    }
    if(!seller.isEmailVerified){
        return res.status(404).json({message:"EmailVerify not successful"});
    }
    const result = await bcrypt.compare(password,seller.password);
    if(!result){
        return res.status(400).json({message:"Password is incorrect"});
    }
    const token = jwt.sign(
        {id:seller._id,email:seller.email},
        process.env.JWT_SECRET,
        {expiresIn:"1h"}
    )
    res.status(200).json({message:"Seller logged in successfully",token});
}catch(error){
    res.status(500).json({message:"Error logging in seller",error});

}

});


router.post('/sellers', async (req, res) => {
    try {
        const { name, email, password, address, storeName,contact } = req.body;

        // Check for missing required fields
        if (!name || !email || !password || !storeName || !contact || !address) {
            return res.status(400).json({ message: "All fields are required." });
        }
        
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: "Seller already exists." });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("hashedPassword",hashedPassword);


        // otp 
        const otp = generatedOTP();
        console.log("otp",otp);
        const otpToken = jwt.sign({email,otp},process.env.JWT_SECRET,{expiresIn:"10m"});
        console.log(otpToken);
        

        await
        sendEmail(email,otp);

        const newSeller = new Seller({ name, email, password: hashedPassword, storeName, contact, address });
        // const mailOptions = {
        //     from: process.env.Email_USER,
        //     to: email,
        //     subject: 'Seller Registration',
        //     text: `Hello ${name} ,\n\nYou have been registered successfully.\n\nThanks`
        // };
        const emailResult = await sendEmail(email,otp);
        await newSeller.save();
        res.status(200).json({ message: "Seller created successfully", emailResult,seller: newSeller });

    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error creating Seller", error: error.message });
    }
});



router.post("/sellers/bulk", async (req, res) => {
    try {
        const sellers = req.body;
        if (!Array.isArray(sellers) || sellers.length === 0) {
            return res.status(400).json({ message: "Invalid data pass kar raha ho  " });
        }
        const emails = sellers.map(sellerdata => sellerdata.email);

        const SellerModel = require("../models/Seller"); // Assuming you have the seller model in Seller.js file
        const existingUserCount = await SellerModel.find({ email: { $in: emails } }).countDocuments();
        
        if (existingUserCount > 0) {
            return res.status(400).json({ message: "Sellers already exist", existingUserCount });
        }

        const newSellers = await SellerModel.insertMany(sellers);
        res.status(200).json({ message: "Sellers created successfully", sellers: newSellers });
    }
    catch (error) {
        return res.status(500).send({ message: 'Error creating sellers'});
    }
});

router.get("/sellers",async(req,res)=>{
    try{
        const sellers = await Seller.find();
        res.status(200).json({message:"Sellers Fetched Successfully",sellers});
    }catch(error){
        res.status(500).json({ message: "Error fetching sellers",error });
    }
});

router.get("/sellers/:id",async (req,res)=>{
    try{
        const seller = await Seller.findById(req.params.id);
        if(!seller){
            return res.status(404).json({message:"Seller not found"});
        }
        res.status(200).json({message:"Seller Fetched Successfully",seller});           
    }catch(error){
        res.status(500).json({ message: "Error fetching sellers",error });
    }
});

router.put("/Sellers/:id",async(req,res)=>{
    try{
const UpdatesSeller = await Seller.findByIdAndUpdate(req.params.id,req.body,{new:true});
if(!UpdatesSeller){
    return res.status(404).json({message:"Seller not found"});
}
res.status(200).json({message:"Seller Updated Successfully",UpdatesSeller});
    }catch(error){
        res.status(500).json({ message: "Error updating sellers",error });
    }
})

router.patch("/Sellers/:id",async(req,res)=>{
    try{    
        const UpdatesSeller = await Seller.findByIdAndUpdate (req.params.id,req.body,{new:true});
        if(!UpdatesSeller){
            return res.status(404).json({message:"Seller not found"});
        }
        res.status(200).json({message:"Seller Updated Successfully",UpdatesSeller});
    }catch(error){
        res.status(500).json({ message: "Error updating sellers",error });
    }
    })

  router.delete("/Sellers/:id",async(req,res)=>{
    try{

        const deleteSeller = await Seller.findByIdAndDelete(req
            .params.id);
        if(!deleteSeller){
            return res.status(404).json({message:"Seller not found"});
        }
        res.status(200).json({message:"Seller Deleted Successfully",deleteSeller});
    }catch(error){
        res.status(500).json({ message: "Error Deleted sellers",error });
    }
});
       

module.exports = router;