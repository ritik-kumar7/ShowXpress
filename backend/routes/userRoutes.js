import express from "express";
import { createUser, getUserByClerkId } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.post('/create', createUser);
userRouter.get('/:clerkId', getUserByClerkId);

export default userRouter;