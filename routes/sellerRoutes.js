const express = require('express');
const Seller = require("../models/Seller");

const router = express.Router();

// Create a route for POST Seller

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

        const newSeller = new Seller({ name, email, password, storeName, contact, address });
        await newSeller.save();
        res.status(200).json({ message: "Seller created successfully", seller: newSeller });
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

module.exports = router;