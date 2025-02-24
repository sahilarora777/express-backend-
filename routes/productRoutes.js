const express = require('express');

const multer = require('multer');
const Product = require('../models/Product');

const cloudinary = require("../config/cloudinary");


const router = express.Router();
const authMiddleware = require("../middlewares/authmiddleware");

// Multer configuration storage

const storage = multer.memoryStorage();
const upload = multer({storage});

// Create a route for POST Product

router.post('/products',authMiddleware,upload.single('image'),async (req, res) => {
try{
    let imageUrl="";
    if(req.file){
        const result = await new Promise((resolve, reject) => {
       const stream = cloudinary.uploader.upload_stream({folder: "products"}, (error, result) => {
           if (result) {
               resolve(result);
           } else {
               reject(error);
           }
       }); 
         stream.end(req.file.buffer);
    });
    imageUrl = result.secure_url;
}
const { name, price, description, category,quantity,seller } = req.body;

const product = new Product({ name, price, description, category,quantity,seller,imageUrl });

await product.save();
res.status(201).json(product);

}catch(error){
    res.status(500).json({ message: "An error occur due to some issue",error });
}
}
);

router.post('/products/bulk',  async (req, res) => {
    try {
      const products = req.body;
  
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty product data' });
      }
  
      const savedProducts = await Product.insertMany(products);
  
      res.status(201).json(savedProducts);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while adding products', error });
    }
  });
  

router.get("/home_products",async(req,res)=>{
    try{
        const products = await Product.find();
        res.status(200).json({message:"Products Fetched Successfully",products});
    }catch(error){
        res.status(500).json({ message: "Error fetching products",error });
    }
});

router.patch("/update_products/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const Updatedproduct=await Product.findByIdAndUpdate(id,req.body,{new:true});
        if(!Updatedproduct){
            return res.status(404).json({message:"Product not found"});
        }
        res.status(200).json({message:"Product Updated Successfully",Updatedproduct});
    }catch(error){
        res.status(500).json({ message: "Error updating products",error });
    }
}
);

module.exports = router;