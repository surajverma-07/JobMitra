import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import cloudinary from "cloudinary";
import { ApiResponse } from "../utils/ApiResponse.js";

export const postApplication = AsyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (!role) {
    return next(new ErrorHandler("Role not found || User not authorized", 400));
  }
  if (role === "Employer") {
    return next(new ErrorHandler("Employers cannot apply for jobs", 400));
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume file is required", 400));
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(new ErrorHandler("Invalid file format. Please upload JPEG, PNG, or PDF files only.", 400));
  }

  let cloudinaryResponse;
  try {
    cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath);
    console.log("Cloudinary Response:", cloudinaryResponse);
  } catch (error) {
    return next(new ErrorHandler(`Cloudinary error: ${error.message || "Unknown cloudinary error"}`, 500));
  }

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    return next(new ErrorHandler(`Cloudinary error: ${cloudinaryResponse.error.message || "Unknown cloudinary error"}`, 400));
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;
  if (!(email && name && coverLetter && phone && address)) {
    return next(new ErrorHandler("Please fill out the form completely", 400));
  }

  const applicantID = {
    user: req.user._id,
    role: "Job Seeker"
  };

  if (!jobId) {
    return next(new ErrorHandler("Job not found", 404));
  }

  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found", 404));
  }

  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer"
  };

  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Application Submitted!", application));
});


export const employerGetAllApplications = AsyncHandler(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    return res.status(200).json(
        new ApiResponse(
            200,
            "Employer get all the application",
            applications,
        )
    )
  }
);

export const jobseekerGetAllApplications = AsyncHandler(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json(
        new ApiResponse(
            200,
            "Job Seeker get all the application",
            applications,
        )
    )
  }
);

export const jobseekerDeleteApplication = AsyncHandler(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json(
        new ApiResponse(
            200,
            "Application deleted successfully",
        )
    )
  }
);