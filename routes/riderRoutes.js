import { Router } from "express";
import { verifyRider } from "../middlewares/authentication.js";
import {
  confirmDelivery,
  getAllDeliveries,
  getDelivery,
  getRider,
  loginRider,
  pickUpDelivery,
  reportDeliveryFailure,
  signupRider,
  updateAvailability,
} from "../controllers/riderController.js";

export const riderRouter = Router();

riderRouter
  .post("/signup", signupRider)
  .post("/login", loginRider)
  .use(verifyRider)
  .get("/get-rider", getRider)
  .get("/get-all-deliveries", getAllDeliveries)
  .get("/get-delivery/:id", getDelivery)
  .post("/pickup-delivery/:deliveryId", pickUpDelivery)
  .post("/confirm-delivery/:deliveryId", confirmDelivery)
  .post("/update-availability/:status", updateAvailability)
  .post("/report-delivery-failure/:deliveryId", reportDeliveryFailure);
