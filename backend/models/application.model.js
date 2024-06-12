import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            minLength:[3,"your name must contain 3 letters "],
            maxLength:[30,"Name letters does not exceed from 30"],
          },
          email:{
            type:String,
            required:[true,"Please Enter a email"],
            validate:[validator.isEmail,"Provide a valid email"],
        
          },
          phone:{
             type:Number,
             required:[true,"Please Provide your phone no."] ,
          },
          coverLetter : {
            type:String,
            required:[true,"Please Provide your cover letter"]
          },
          address:{
            type:String,
            required:[true,"Please Provide your address"]
          },
          resume:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
          },
          applicantID:{
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            role:{
                type: String,
                enum:["Job Seeker"],
                required:true,
            }
          },
          employerID:{
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            role:{
                type: String,
                enum:["Employer"],
                required:true,
            }
          },

    }
)

export const Application = mongoose.model("Application",applicationSchema)