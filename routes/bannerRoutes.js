const express = require('express');
const mongoose = require('mongoose');
const  banner =  require ("../models/Banner.js");


const router = express.Router();

// POST API to add multiple banner images
router.post('/banners', async (req, res) => {
    console.log('POST /banners hit'); // Check if this shows up in your terminal
    try {
      const banners = await banner.insertMany(req.body.images);
      res.status(201).json(banners);
    } catch (error) {
      console.error('Error adding banners:', error);
      res.status(500).json({ message: 'Failed to add banners', error });
    }
  });
  
  router.get('/banners', async (req, res) => {
    try {
      const banners = await banner.find();
      res.status(200).json(banners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      res.status(500).json({ message: 'Failed to fetch banners', error: error.message });
    }
  });

module.exports = router;
