import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
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
  password:{
     type:String,
     required:[true,"Please Enter a password"] ,
     minLength:[8,"your password must contain 8 letters "],
    maxLength:[30,"password letters does not exceed from 30"],
  },
  role:{
    type:String,
    required:[true,"Please enter your role "],
    enum:["Job Seeker","Employer"],
  }
},
{
    timestamps:true,
});

//Hashing password 
userSchema.pre("save", async function(next){
   if(!this.isModified("password")) next();
   this.password = await bcrypt.hash(this.password,10);
})

//Comparing Password
userSchema.methods.isPasswordCorrect = async function(EnteredPassword){
   return await bcrypt.compare(EnteredPassword,this.password);
}

//Genrating a JWT for authorization 
userSchema.methods.genrateJwt =  function(){
    return jwt.sign({
        id: this._id,
    },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn:process.env.JWT_EXPIRE,
        },

    )
}


export const User = mongoose.model("User",userSchema);