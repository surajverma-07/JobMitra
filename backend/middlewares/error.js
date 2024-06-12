
class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode =statusCode;
        this.success = false;
    }
}

export const errorMiddleware = (err,req,res,next) =>{
    err.message = err.message || "Something went wrong";
    err.statusCode = err.statusCode || 500;

    if(err.name === "CaseError"){
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message,500)
    }
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered `;
        err = new ErrorHandler(message,400)
    }
    if(err.name === "JsonWebTokenError"){
        const message = `JsonWebToken is invalid ! Try Again `;
        err = new ErrorHandler(message,400)
    }
    if(err.name === "TokenExpiredError"){
        const message = `JsonWebToken is Expired ! `;
        err = new ErrorHandler(message,500)
    }

    return res
    .status(err.statusCode)
    .json({
        success:false,
        message:err.message,
    });
}

export default ErrorHandler;