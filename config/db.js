const mongoose = require('mongoose');

require('dotenv').config();
// env se mongo uri ho use karna ke liya 

const connectDB = async () => {

    try {
await mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
console.log(" MongoDb connected to db Successfully");
    } catch(error) {
console.log('Mongodb connection failed' , error);
process.exit(1);    
}
}

module.exports= connectDB;