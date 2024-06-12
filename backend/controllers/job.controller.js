import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/job.model.js";
import {ApiResponse} from '../utils/ApiResponse.js'

const getAlljobs = AsyncHandler(
    async (req,res,next)=>{
        const jobs = await Job.find({expired:false});
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "All Jobs get successfully",
                jobs
            )
        )
    }
)

const postJob = AsyncHandler(
    async (req,res,next)=>{
        // const role = req.user.role;
        //above is same as -> 
        const {role} = req.user;
        if(!role){
            return next(new ErrorHandler("User role is not defined ",501 ))
        }
        if(role === "Job Seeker"){
            return next(new ErrorHandler("Job Seeker can not post jobs ",401 ))
        }

        //if we reach at this line that means we can now able to create job
        const {title,description,category,country,location,fixedSalary,salaryFrom ,city, salaryTo} = req.body;

        if(!(title&&description&&category&&country&&location&&city)){
            return next(new ErrorHandler("Please Provide full job details ", 400))
        }

        if((!salaryFrom || !salaryTo) && !fixedSalary){
            return next(new ErrorHandler("Please either provide fixed salary or ranged salary ", 400))
        }

        if(salaryFrom && salaryTo && fixedSalary){
            return next(new ErrorHandler("Can not enter fixed salary and ranged salary together", 400))
        }
        const postedBy = req.user._id;

        const job = await Job.create({
            title,
            description,
            category,
            country,
            city,
           location,
           fixedSalary,
           salaryFrom,
           salaryTo,
           postedBy,
        })

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Job Created Successfully",
                job
            )
        )

    }
)

const getMyJobs = AsyncHandler(
    async (req, res, next) => {
   try {
     const { role } = req.user;
     console.log("role : ",role);
     if (role === "Job Seeker") {
       return next(
         new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
       );
     }
     const myJobs = await Job.find({ postedBy: req.user._id });
     console.log("myJobs :" , myJobs);
     return res
     .status(200)
     .json(
         new ApiResponse(
             200,
             "My jobs are listed successfully",
             myJobs
         )
       )
   } catch (error) {
     console.log("error while getting my job : ",myJobs);
   }
  }
)

const updateJob = AsyncHandler(
    async (req,res,next) =>{
        const {role} = req.user;
        if(role==="Job Seeker"){
            return next(new ErrorHandler("JobSeeker doesn't posted any job",401))
        }

        const {id} = req.params;
        let job = await Job.findById(id)
        if(!job){
            return next(new ErrorHandler("Job not found ",404))
        }
        job = await Job.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:false 
        })

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "job details updated successfully",
                job
            )
        )
    }
) 
const deleteJob = AsyncHandler(
    async (req,res,next) =>{
        const {role} = req.user;
        if(role==="Job Seeker"){
            return next(new ErrorHandler("JobSeeker doesn't posted any job",401))
        }

        const {id} = req.params;
        let job = await Job.findById(id)
        if(!job){
            return next(new ErrorHandler("Job not found ",404))
        }
        job = await Job.findByIdAndDelete(id);

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "job deleted successfully",
                job
            )
        )
    }
)

const getJob = AsyncHandler(
    async (req,res,next) =>{
       try {
         const {id} = req.params;
         const job = await Job.findById(id)
         if(!job){
             return next(new ErrorHandler("Job not found ",404))
         }
         return res
         .status(200)
         .json(
             new ApiResponse(
                 200,
                 "Job geted Successfully",
                 job
             )
         )
       } catch (error) {
          
       }
    }
)

export{
    getAlljobs,
    postJob,
    getMyJobs,
    updateJob,
    deleteJob,
    getJob
}