import { Router } from "express";
import {
  adminLoginController,
  adminSignupController,
} from "../controllers/adminController.js";

/* Instantiate a new router for the admin routes */
export const adminRouter = Router();

/* Define routes with controllers to work with the admin router */
adminRouter
  .post("/signup", adminSignupController) // admin signup route
  .post("/login", adminLoginController); // admin login route
