 import mongoose from "mongoose";

const dbConnection = () =>{
    mongoose.connect("mongodb+srv://mongodb:f6ae4wjVEkhclxsj@cluster0.vzyqs.mongodb.net/policy")
    .then(()=>{
        console.log("db connected successfully");
    }).catch(e=>{
        console.log("something went wrong in db connection");
    })
}

export default dbConnection
