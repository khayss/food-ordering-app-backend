import { Router } from "express";
import { verifyUser } from "../middlewares/authentication.js";
import {
  createOrder,
  getDeliveryStatus,
  getOrder,
  getUser,
  userLoginController,
  userSignupController,
} from "../controllers/userControllers.js";
import { userSignupUpload } from "../middlewares/multer.js";

export const userRouter = Router();

userRouter
  .post("/signup", userSignupUpload, userSignupController)
  .post("/login", userLoginController)
  .use(verifyUser)
  .get("/get-user", getUser)
  .get("/delivery-status/:id", getDeliveryStatus)
  .get("/get-order", getOrder)
  .post("/create-order", createOrder);
