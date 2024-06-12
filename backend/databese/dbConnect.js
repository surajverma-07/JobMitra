import mongoose from "mongoose";

export  const dbConnect = async ()=>{
    mongoose.connect(
        process.env.MONGO_URI , {
            dbName:"JOB_SEEKER"
        }
    ).then((response)=>{
        console.log("DataBase Connected successfully ");
    }).catch(
        (err)=>{
            console.log("Error while connecting to database ",err);
        }
    )
}