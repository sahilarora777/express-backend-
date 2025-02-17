const express = require('express');
const User = require("../models/User");
const {sendEmail} = require("../config/emailConfig");
require('dotenv').config();
const jwt = require("jsonwebtoken");

const router = express.Router();

// Create a route for POST users


router.post("/user/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const token = jwt.sign(
        { id: user._id, email: user.email },  // Include user ID in the token
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({ message: "User logged in successfully", token });
  
      console.log("User logged in successfully", token);
    } catch (error) {
      console.error("Login error:", error); // Add detailed error logging!
      res.status(500).json({ message: "Error logging in user", error: error.message }); //Include error message
    }
  });


router.post('/users', async (req, res) => {
    try {
        const { name, email, password, dob, phone } = req.body;

        // Check for missing required fields
        if (!name || !email || !password || !dob || !phone) {
            return res.status(400).json({ message: "All fields are required." });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const newUser = new User({ name, email, password, dob, phone });
        const mailOptions = {
            from: process.env.Email_USER,
            to: email,
            subject: 'User Registration',
            text: `Hello ${name},\n\nYou have been registered successfully.\n\nThanks`
        };
        const emailResult = await sendEmail(mailOptions);
        await newUser.save();
        res.status(200).json({ message: "User registered successfully and mail sent successfully",  emailResult });
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error creating User", error: error.message });
    }
});
 
    router .get("/users/:id",async (req,res)=>{
try{
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    res.status(200).json({message:"User Fetched Successfully",user});           
}catch(error){
    res.status(500).json({ message: "Error fetching users",error });
}
    });

router.put("/users/:id",async (req,res)=>{
    try{
        const Updateduser = await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!Updateduser){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"User Updated Successfully",Updateduser});
    }catch(error){
        res.status(500).json({ message: "Error updating users",error });
    }
});

 router.patch("/users/:id",async (req,res)=>{
     try{
         const Updateduser = await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
            if(!Updateduser){
                return res.status(404).json({message:"User not found"});
            }
            res.status(200).json({message:"User Updated Successfully",Updateduser});
        }catch(error){
            res.status(500).json({ message: "Error updating users",error });
        }
    });

    router.delete("/users/:id",async (req,res)=>{
        try{
            const deleteuser = await User.findByIdAndDelete(req.params.id,req.body,{new:true});
               if(!deleteuser){
                   return res.status(404).json({message:"User not found"});
               }
               res.status(200).json({message:"User Deleted Successfully",deleteuser});
           }catch(error){
               res.status(500).json({ message: "Error Deleted users",error });
           }
       });
   

module.exports = router;