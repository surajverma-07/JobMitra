import ErrorHandler from "../middlewares/error.js";
import { ApiResponse } from "./ApiResponse.js";

export const sendToken = (user,statusCode,res,message) =>{
    const token = user.genrateJwt();
    console.log("genrated user token successfully : ",token)
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'None',  // Allows cross-site cookie setting
    };
    
    // The rest of the sendToken function remains the same
    
    
    if(!token){
        return next(new ErrorHandler("Error while getting jwt token in sendToken method ",500))
    }
    return res
    .status(statusCode)
    .cookie("token",token,options)
    .json(
        new ApiResponse(
            statusCode,
            message,
            {
                token,
                user
            }
        )
    )
}