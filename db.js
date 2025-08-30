const mongoose= require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
    userId:ObjectId,
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    firstName:String,
    lastName:String,
    // used the property of noSQL
    PurchasedCourses: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Courses',
        }
    ]
})

const Admin = new Schema({
    id:ObjectId,
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    firstName:String,
    lastName:String
})

const Courses = new Schema({
    id:ObjectId,
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId:ObjectId
 
}) 

//more SQL way
const Purchase = new Schema({
    id:ObjectId,
    courseId:String,
    userId:String
})
 
const UserModel = mongoose.model('user',User);
const AdminModel = mongoose.model('admin',Admin);
const CoursesModel = mongoose.model('course',Courses);
const PurchaseModel = mongoose.model('purchase',Purchase)

module.exports={
     UserModel,
     AdminModel,
     CoursesModel,
     PurchaseModel
}