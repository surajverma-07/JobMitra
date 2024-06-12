import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendToken } from "../utils/jwtToken.js"; 
//Register 
const registerUser = AsyncHandler(
    async (req,res,next) =>{

        //taking data from frontend
        const {name,email,phone,password,role} = req.body;
        //throw error if any of these fields are not present 
        if(!(name&&email&&phone&&password&&role)){
            return next(new ErrorHandler("All fields are required while registering the user ",400));
        }

        //check wheather user is already registered or not from email
        const isUserRegistered = await User.findOne({email});
        if(isUserRegistered){
            return next(new ErrorHandler("User already registered",401));
        }

        const user = await User.create({
            name,
            email,
            phone,
            password,
            role,
        })
        

       sendToken(user,200,res,"user registered successfully");

    }
);

//Login
const login = AsyncHandler(
    async (req,res,next) => {
        const {email,password,role} = req.body;
        if(!(email&&password&&role)){
            return next(new ErrorHandler("All feilds are required while login ",400))
        }
        const user = await User.findOne({email})
        // const user = await User.findById(req.user._id);
        if(!user){
            return next(new ErrorHandler("User not found !! please Resgister first "))
        }
        const isPasswordCorrect =  await user.isPasswordCorrect(password);
        if(!isPasswordCorrect){
            return next(new ErrorHandler("Wrong Password ! please enter correct password "));
        }

        if(user.role !== role){
            return next(new ErrorHandler("Invalid role selected "));
        }
       
        sendToken(user,200,res,"User Logged in Successfully ")
    }
)

//logout
const options = {
    expires: new Date(
        Date.now()),
        httpOnly: true,
    secure:true,
     sameSite: 'None',  // Allows cross-site cookie setting
}
const logout = AsyncHandler(
    async (req,res,next) =>{
        return res
        .status(200)
        .cookie("token","",options)
        .json(
            new ApiResponse(200,"User Logged Out Successfully")
        )
    }
)

const getCurrentUser = AsyncHandler(
    async (req,res,next) => {
        const user = req.user
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Current User fetched Successfully",
                user
            )
        )

    }
)
export {
    registerUser,
    login,
    logout,
    getCurrentUser

}