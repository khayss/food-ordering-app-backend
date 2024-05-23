import { Router } from "express";
import { getFoodById, getFoods } from "../controllers/generalControllers.js";

export const generalRouter = Router();

generalRouter.get("/get-foods", getFoods).get("/food/:id", getFoodById);
