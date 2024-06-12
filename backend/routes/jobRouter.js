import express,{Router} from "express";
import { deleteJob, getAlljobs, getJob, getMyJobs, postJob, updateJob } from "../controllers/job.controller.js";
import { isAuthorized } from "../middlewares/auth.js";

const router = Router();
router.get("/jobs",isAuthorized,getAlljobs)
router.get("/myjob",isAuthorized,getMyJobs)
router.get('/:id',isAuthorized,getJob)
router.post("/post_job",isAuthorized,postJob)
router.put("/update_job/:id",isAuthorized,updateJob)
router.delete("/delete_job/:id",isAuthorized,deleteJob)
export default router;



