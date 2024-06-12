import { User } from "../models/user.model.js";
import { AsyncHandler } from "./AsyncHandler.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthorized = AsyncHandler(
    async (req,res,next)=>{
        const {token} = req.cookies;
        if(!token){
            return next(new ErrorHandler("User not authorized || token not get",400));
        }

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);

        if(!decodedToken){
          return next(new ErrorHandler("Decoded token can't get  ",500));
        }

        req.user = await User.findById(decodedToken.id);
        next();
    }
)