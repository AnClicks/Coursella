const {Router} = require("express")
const adminRouter=Router();
const {AdminModel, CoursesModel} = require("../db")
const express = require("express")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {adminMiddleware}=require("../middlewares/admin");
const {JWT_ADMIN_PASSWORD}= require("../config")

const app = express();

//body parser middleware
app.use(express.json())

adminRouter.post("/signup", async (req,res)=>{
    const email= req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const hashedpassword = await bcrypt.hash(password,5);

    try{
       await AdminModel.create({
            email,
            password:hashedpassword,
            firstName,
            lastName
        })
    }
    catch(e){
        res.status(401).json({
            error:"Your account already exists "+e
        })
    }
    res.status(200).json({
        message:"You are signed up"
    })
})
adminRouter.post("/signin",async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;

    const admin = await AdminModel.findOne({
        email:email,
    })
    if(!admin){
        res.status(403).json({
            error:"You are not signed up"
        })
        return;
    }

    const passwordMatch = await bcrypt.compare(password,admin.password);

    if(passwordMatch){
        const token = jwt.sign({
            id:admin._id,
        },JWT_ADMIN_PASSWORD);

        res.status(200).json({
            token:token
        })
        return;
    }
    else{
        res.status(403).json({
            error:"Incorrect Credentials"
        })
        return;
    }

})
adminRouter.post("/course",adminMiddleware,async (req,res)=>{
    const adminId = req.adminId;
    const {title,description,imageUrl,price} = req.body;
   const course= await CoursesModel.create({
        title,
        description,
        imageUrl,
        price,
        creatorId:adminId
    })
    res.status(200).json({
        message:"Course created",
        courseId:course._id
    })
})
adminRouter.put("/course",adminMiddleware,async(req,res)=>{
    const adminId = req.adminId;
    const {title,description,imageUrl,price,courseId}  = req.body;
    await CoursesModel.updateOne({
        _id:courseId,
        creatorId:adminId
    },{
        title:title,
        description:description,
        imageUrl:imageUrl,
        price:price
    })
        res.json({
            message:"Course updated"
        })


})
adminRouter.get("/course/bulk",adminMiddleware,async(req,res)=>{
    const adminId = req.adminId;
    try{
        const courses = await CoursesModel.find({
            creatorId:adminId,
        })
        res.status(200).json({
            allCourses:courses,
        })
        return;
    }
    catch(err){
        res.status(404).json({
            error: "you have not created any courses "+err
        })
        return;
    }
})
module.exports={
    adminRouter:adminRouter
}