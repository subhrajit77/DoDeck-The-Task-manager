import express from "express";
import {
    registerUser,
    loginUser,
    getCurentUser,
    updateProfile,
    updatePassword,
} from "../controllers/userController";
import authMiddleware from "../middleware/auth";

const userRouter = express.Router();

//Public links
userRouter.post("./register", registerUser);
userRouter.post("./login", loginUser);

//Private Links protect also
userRouter.get("./me", authMiddleware, getCurentUser);
userRouter.put("./profile", authMiddleware, updateProfile);
userRouter.put("./password", authMiddleware, updatePassword);
