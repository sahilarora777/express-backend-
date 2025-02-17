const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
items:[{
    product:{type:mongoose.Schema.Types.ObjectId,ref:"product",required:true},
    seller:{type:mongoose.Schema.Types.ObjectId,ref:"Seller",required:true},
    quantity:{type:Number,default:1,required:true},
}],
totalAmount:{type:Number,required:true},
status:{type:String,default:"Pending",enum:["Pending","Processing","Shipped","Delivered","Cancelled"]},
paymentMethod:{type:String,required:true,enum:["COD","Online"]},
paymentStatus:{type:String,default:"Pending",enum:["Pending","Paid"]},
address:{type:String,required:true},
orderedAt:{type:Date,default:Date.now()},
});

module.exports=mongoose.model("Order",orderSchema);