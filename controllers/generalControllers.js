import { FoodModel } from "../models/foodModel.js";
import { catchErrorFunc } from "../utils/catchErrorFunc.js";

export const getFoods = catchErrorFunc(async (req, res) => {
  const page = Math.abs(Number(req.query.page)) || 0;
  const limit = Math.abs(Number(req.query.limit)) || 20;

  const foods = await FoodModel.find(
    {},
    { createdBy: 0, lastUpdatedBy: 0 },
    { limit, skip: page * limit }
  );
  res.status(200).json({ success: true, data: { foods, limit, page } });
});

export const getFoodById = catchErrorFunc(async (req, res) => {
  const { id } = req.params;
  const food = await FoodModel.findById(id, { createdBy: 0, lastUpdatedBy: 0 });
  res.status(200).json({ success: true, data: { food } });
});
