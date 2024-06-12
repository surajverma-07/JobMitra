import express,{Router} from "express";
import { getCurrentUser, login, logout, registerUser } from "../controllers/user.controller.js";
import { isAuthorized } from "../middlewares/auth.js";

const router = Router();
router.post("/register",registerUser)
router.post("/login" , login)
router.get("/logout" ,isAuthorized,  logout)
router.get("/getuser" ,isAuthorized,  getCurrentUser)
export default router;


