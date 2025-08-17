const jwt = require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD}= require("../config")


async function  adminMiddleware(req,res,next){
    const token=req.headers.token;
    const decodedInfo = jwt.verify(token,JWT_ADMIN_PASSWORD);
    // console.log(decodedInfo.id);
    //finding the admin
    if(decodedInfo){
        req.adminId = decodedInfo.id;
        next();
    }
    else{
        res.status(403).json({
            message:"Your are not siggned in as ADMIN"
        })
    }
}
module.exports={
    adminMiddleware:adminMiddleware
}