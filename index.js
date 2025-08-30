require("dotenv").config()
const express = require("express");
const {userRouter}= require("./routes/user");
const { courseRouter } = require("./routes/course");
const {adminRouter} = require("./routes/admin");
const mongoose = require("mongoose");
const {PORT} = require("./config")

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
        app.listen(PORT,()=>{
            console.log(`Backend is running at: http://localhost:${PORT}/`)
        });
    }
    catch(e){
        console.log("Database Error:"+e);
    }
    
}
main()