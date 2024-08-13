 import mongoose from "mongoose";

const dbConnection = () =>{
    mongoose.connect("mongodb://localhost:27017/policy")
    .then(()=>{
        console.log("db connected successfully");
    }).catch(e=>{
        console.log("something went wrong in db connection");
    })
}

export default dbConnection
