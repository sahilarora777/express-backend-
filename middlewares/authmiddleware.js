const jwt = require('jsonwebtoken');

const authmiddleware = async(req,res,next)=>{
const authHeader = req.headers.authorization;
if(authHeader && authHeader.startsWith('Bearer')){
    const token  = authHeader.split(' ')[1];
    try{
const decoded  = jwt.verify(token,process.env.JWT_SECRET);

// sucessfully verified  then value is stored in decoded
req.user = decoded;
next();

    }catch(error){
        res.status(401).json({message:"Token is not valid"});
    }
}
else{
    res.status(401).json({message:"Token is not provided, authorixation denied"});
}
}

module.exports = authmiddleware;