require("dotenv").config()
// console.log(process.env.MONGO_URI)
const express = require("express");
const {userRouter}= require("./routes/user");
const { courseRouter } = require("./routes/course");
const {adminRouter} = require("./routes/admin");
const mongoose = require("mongoose");


const app = express();

app.use(express.json())

app.use('/api/v1/user',userRouter);
app.use('/api/v1/course',courseRouter);
app.use('/api/v1/admin',adminRouter);


//this will ensure that i am connect to the db and serving
async function main() {
    const MONGO_URI=process.env.MONGO_URI;
    // console.log(MONGO_URI);
    try{
        await mongoose.connect(MONGO_URI)
        app.listen(3000,()=>{
            console.log("listening to the 3000 port")
        });
    }
    catch(e){
        console.log("Database Error:"+e);
    }
    
}
main()