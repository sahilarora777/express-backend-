const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({

    imageUrl:{type:String,},

});

module.exports=mongoose.model("Banner",BannerSchema);