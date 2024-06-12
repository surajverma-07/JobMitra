import mongoose,{Schema, Types} from "mongoose";

const jobSchema = new Schema(
    {
    title:{
        type:String,
        required:[true,"job title is neccessary"],
        minLength:[2,"Job title must contain atleast 2 character"]    
    },
    description:{
        type:String,
        required:[true,"job description is neccessary"],
        minLength:[10,"Job description must contain atleast 10 character"]    
    },
    category:{
        type:String,
        required:[true,"Category is required"]
    },
    country:{
        type:String,
        required:[true,"Country is required"]
    },
    city:{
        type:String,
        required:[true,"City is required"]
    },
    location:{
        type:String,
        required:[true,"Provide Exact location"],
        minLength:[30,"job location must contain atleast 30 character"]
    },
    fixedSalary:{
        type:Number,
        minLength:[4,"Atleast you pay 1k for a job"]
    },
    salaryFrom:{
        type:Number,
        minLength:[4,"Atleast you pay 1k for a job"]
    },
    salaryTo:{
        type:Number,
        minLength:[4,"Atleast you pay 1k for a job"]
    },
    expired:{
        type:Boolean,
        default:false
    },
    jobPostedOn:{
        type:Date,
        default:Date.now()
    },
    postedBy:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

    },
    {
        timestamps:true
    }
);

export const Job = mongoose.model("Job",jobSchema)