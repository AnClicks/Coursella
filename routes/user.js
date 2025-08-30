    const {Router} = require("express");
    const express = require("express")
    const bcrypt = require("bcrypt")
    const {UserModel} = require("../db")
    const jwt = require("jsonwebtoken");
    const { z } = require("zod");
    const {JWT_USER_PASSWORD} = require("../config")
    const {userMiddleware} = require("../middlewares/user")
    const { PurchaseModel } = require( "../db")

    const userRouter = Router();
    const app = express();
    app.use(express.json())
    
    userRouter.post("/signup", async (req,res)=>{
        //user details validation 
        const requiredBody = z.object({
             email: z.email(),
             password: z.string()
             .min(8,"Passowrd must be 8 character long")
             .max(32,"Password must be less than 32 characters")
             .regex(/[A-Z]/,"Password must have a upper letter")
             .regex(/[a-z]/,"Password must have a small case letter")
             .regex(/[^A-Za-z0-9]/,"Password must have a special character")
                
        })
        
        const parsedDatawithSuccess = requiredBody.safeParse(req.body);
        // console.log(parsedDatawithSuccess)
        if(!parsedDatawithSuccess.success){
            res.json({
                message:"Incorrect format",
                error:parsedDatawithSuccess.error
            })
            return;
        }
        //All this four line in one line destructing
        const {email,password,firstName,lastName} = req.body
        
        
        const hashedpassword = await bcrypt.hash(password,5)
        // console.log(hashedpassword)
        try{
            await UserModel.create({
                email,
                password:hashedpassword,
                firstName,
                lastName,
            })
        }
        catch(e){
            res.status(402).json({
                error:"Your account already exists: "+e
            })
            return
        }
        res.json({
            message:"Your are logged in"
        })
       
       
        
    })
    userRouter.post("/signin",async (req,res)=>{
        const email=req.body.email;
        const password=req.body.password;
        
        const user = await UserModel.findOne({
            email:email,
        })
        if(!user){
            res.status(403).json({
                error:"You are not signed up"
            })
            return;
        }
        
        const passwordMatch = await bcrypt.compare(password,user.password);
        
        if(passwordMatch){
            const token = jwt.sign({
                id:user._id,
            },JWT_USER_PASSWORD);
            
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
    userRouter.get("/purchases",userMiddleware,async (req,res)=>{
        const userId = req.userId;
        try{
            const courses = await PurchaseModel.find({
                userId,
            })
            res.json({
                courses
            })
            return;
        }
        catch(err){
            res.json({
                error:"Error while getting your courses"
            })
            return;
        }
    })
module.exports={
    userRouter:userRouter
}