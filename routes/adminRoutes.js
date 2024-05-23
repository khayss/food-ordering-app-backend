import { Router } from "express";
import {
  adminLoginController,
  adminSignupController,
  approveRider,
  createFood,
  deleteFood,
  getAdmin,
} from "../controllers/adminControllers.js";
import { adminSignupUpload, createFoodUlpoad } from "../middlewares/multer.js";
import { verifyAdmin } from "../middlewares/authentication.js";
// import { handleSignupUpload } from "../middlewares/multer.js";

/* Instantiate a new router for the admin routes */
export const adminRouter = Router();

/* Define routes with controllers to work with the admin router */
adminRouter
  .post("/signup", adminSignupUpload, adminSignupController) // admin signup route
  .post("/login", adminLoginController)
  .use(verifyAdmin) // admin login route
  .get("/get-admin", getAdmin)
  .post("/create-food", createFoodUlpoad, createFood)
  // .put("/update-food")
  .delete("/delete-food", deleteFood)
  .put("/approve-rider", approveRider)
  .post("/suspend-user")
  .post("/unsuspend-user")
  .get("/pending-riders")
  .get("/riders")
  .post("/suspend-rider")
  .post("unsuspend-rider");
