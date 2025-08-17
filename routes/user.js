    const {Router} = require("express");
    const mongoose= require("mongoose")
    const express = require("express")
    const bcrypt = require("bcrypt")
    const {UserModel} = require("../db")
    const jwt = require("jsonwebtoken");
    // const { z } = require("zod");
    const {JWT_USER_PASSWORD} = require("../config")
    const {userMiddleware} = require("../middlewares/user")
    const { PurchaseModel } = require( "../db")

    const userRouter = Router();
    const app = express();
    app.use(express.json())

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
    userRouter.post("/signup", async (req,res)=>{
        //user details validation 
        //    const requiredBody
        
        
        // const email = req.body.email;
        // // console.log(email)
        // const password = req.body.password;
        // // console.log(password)
        // const firstName = req.body.firstName;
        // const lastName = req.body.lastName;
        
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