import express from "express";
import { registerAdmin, loginAdmin, getAdminProfile } from "../controllers/adminController.js";
import { verifyAdminToken } from "../middleware/adminAuth.js";

const adminRouter = express.Router();

// Public routes
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);

// Protected routes
adminRouter.get("/profile", verifyAdminToken, getAdminProfile);

export default adminRouter;
