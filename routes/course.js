const {Router} = require("express");
const courseRouter = Router();
const {userMiddleware} = require("../middlewares/user");
const express = require("express");
const {PurchaseModel} = require("../db");
const { CoursesModel } = require("../db");

const app = express();

app.use(express.json());


courseRouter.post("/purchase",userMiddleware,async (req,res)=>{
  const userId = req.userId
//   console.log(userId)
  const courseId = req.body.courseId;
  try{
   await PurchaseModel.create({
        userId,
        courseId
    })
    res.status(200).json({
        message:"Congratulation you succefully purchased a course"
    })
    return;
  }
  catch(err){
    res.json({
        error:"Error while purchaning the course "+err
        
    })
    return;
  }
  }
)
courseRouter.get("/preview",async (req,res)=>{
    const courses = await CoursesModel.find({})
    res.json({
        courses
    })
})

module.exports={
    courseRouter:courseRouter
}