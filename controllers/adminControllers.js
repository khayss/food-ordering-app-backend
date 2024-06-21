import { jwtExpiration, jwtSecret } from "../config/config.js";
import { AppError } from "../utils/error.js";
import { AdminModel } from "../models/adminModel.js";
import { FoodModel } from "../models/foodModel.js";
import {
  validateAdminLoginReqBody,
  validateAdminSignupReqBody,
} from "../utils/adminValidations.js";
import { catchErrorFunc } from "../utils/catchErrorFunc.js";
import { createHash } from "../utils/hash.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateNewFoodReqBody } from "../utils/foodValidations.js";
import { RiderModel } from "../models/riderModel.js";

/* ADMIN SIGNUP CONTROLLER */
export const adminSignupController = catchErrorFunc(async (req, res) => {
  /* function returns validated admin details or throws an error if validation fails */
  const { email, firstname, lastname, password, tel } =
    validateAdminSignupReqBody(req.body);

  /* get the file path from req.file made available by multer */

  const photoPath = req.file?.path;

  /* check if admin with same email or phone number already exists in the database */
  const adminExist = await AdminModel.findOne({ $or: [{ email }, { tel }] });

  if (adminExist && adminExist.email == email)
    throw new AppError(
      "1100",
      409,
      "SIGNUP",
      "Duplicate Registration. Email already in use",
      `Email '${email}' is already in use. Only one account can be registered under the same email`
    );

  /* check if admin with the same tel exist */
  if (adminExist && adminExist.tel == tel)
    throw new AppError(
      "1101",
      409,
      "SIGNUP",
      "Phone number already in use",
      `Phone number '${tel}' is already in use. Each account must have a unique phone number`
    );

  /* create a hash of the password */
  const encryptedPassword = await createHash(password);

  /* create a new admin document and save it to the database */
  const newAdmin = await AdminModel.create({
    email,
    firstname,
    lastname,
    password: encryptedPassword,
    tel,
    profilePicture: photoPath,
  });

  res
    .status(201)
    .json({ success: true, message: "Admin created successfully" });
});

/* ADMIN LOGIN CONTROLLER */
export const adminLoginController = catchErrorFunc(async (req, res) => {
  /* function returns validated admin details or throws an error if validation fails */
  const { email, password } = validateAdminLoginReqBody(req.body);

  /* check if admin with same email already exists in the database */
  const admin = await AdminModel.findOne({ email });
  if (!admin)
    throw new AppError(
      "1101",
      404,
      "LOGIN",
      "Admin account not found",
      `Admin account with email '${email}' not found`
    );

  /* get encrypted password to compare */
  const encryptedPassword = admin.password;

  /* check if password is correct */
  const isPassword = await bcrypt.compare(password, encryptedPassword);
  if (!isPassword)
    throw new AppError(
      "1102",
      406,
      "PASSWORD",
      "Invalid password",
      "Provided password is incorrect"
    );
  /* destructure admin data from database separating the password */
  const { password: adminPassword, ...adminDetails } = admin.toJSON();

  /* sign and generate a jwt token for authentication */
  jwt.sign(
    {
      email,
      id: adminDetails._id,
    },
    jwtSecret,
    { expiresIn: jwtExpiration },
    async (error, token) => {
      if (error)
        throw new AppError(
          "1200",
          500,
          "LOGIN",
          "Server Error",
          "server encountered an error sigining in admin"
        );
      res.status(200).json({ success: true, adminDetails, adminToken: token });
    }
  );
});

/* GET LOGGEDIN ADMIN CONTROLLER  */
export const getAdmin = catchErrorFunc(async (req, res) => {
  const { id } = req.verifiedAdmin;

  const loggedInAdmin = await AdminModel.findById(id);
  const { password, ...adminDetails } = loggedInAdmin.toJSON();
  res.status(200).json({
    success: true,
    adminDetails,
  });
});

/* CREATE NEW FOOD CONTROLLER */
export const createFood = catchErrorFunc(async (req, res) => {
  validateNewFoodReqBody(req.body);
  const { name, category, stock, priceInCents, discountPercentage } = req.body;
  const { id } = req.verifiedAdmin;

  if (!req.files || req.files.length < 1)
    throw new AppError(
      "1201",
      400,
      "CREATE-FOOD",
      "Missing image",
      "Please upload at least one image for the food item"
    );

  /* check if food already exists */
  const foodExists = await FoodModel.findOne({ name });
  if (foodExists) {
    throw new AppError(
      "1201",
      400,
      "FOOD",
      "Food Already Exists",
      "food with the same name already exists"
    );
  }

  const foodImages = req.files?.map((file) => file.path);
  console.log(req.files);
  /* create new food */
  const newFood = await FoodModel.create({
    name,
    category,
    stock,
    priceInCents,
    discountPercentage,
    images: foodImages,
    createdBy: id,
    lastUpdatedBy: id,
  });

  res.status(201).json({ success: true, data: newFood.toJSON() });
});

/* DELETE FOOD CONTROLLER */
export const deleteFood = catchErrorFunc(async (req, res) => {
  const { id } = req.query;

  const food = await FoodModel.findById(id);

  if (!food) {
    throw new AppError(
      "1201",
      404,
      "FOOD",
      "Food Not Found",
      "food with the given id was not found"
    );
  }

  const deletedFood = await FoodModel.deleteOne({ _id: id });

  console.log(deletedFood);

  res.status(200).json({ success: true, message: "food deleted" });
});

export const approveRider = catchErrorFunc(async (req, res) => {
  const { id } = req.verifiedAdmin;

  const riderId = req.body.riderId;
  if (!riderId)
    throw new AppError(
      "1201",
      400,
      "ADMIN",
      "Missing field",
      "'riderId' field missing in req body"
    );
  if (typeof riderId !== "string")
    throw new AppError(
      "1201",
      400,
      "ADMIN",
      "Invalid field",
      "'riderId' field must be a string"
    );
  if (typeof riderId === "string" && riderId.trim().length !== 24)
    throw new AppError(
      "1201",
      400,
      "ADMIN",
      "Invalid field",
      "'riderId' field must be a 24 character string"
    );

  const rider = await RiderModel.findById(riderId);

  if (!rider)
    throw new AppError(
      "1201",
      404,
      "ADMIN",
      "Rider not found",
      "Rider with given 'riderId' not found"
    );

  if (rider.status != "PENDING")
    throw new AppError(
      "1201",
      400,
      "ADMIN",
      "Approval not needed",
      "Approval is not needed for this rider"
    );

  const approvedRider = await RiderModel.findByIdAndUpdate(
    riderId,
    {
      status: "APPROVED",
      approvedBy: id,
      approvedOn: Date.now(),
    },
    { new: true }
  );

  const { password, ...riderDetails } = approvedRider.toJSON();

  res.status(201).json({
    success: true,
    data: {
      message: "rider approved",
      rider: riderDetails,
    },
  });
});

export const getPendingRiders = catchErrorFunc(async (req, res) => {
  const page = Math.abs(Number(req.query.page)) || 0;
  const limit = Math.abs(Number(req.query.limit)) || 20;

  const rider = await RiderModel.find(
    { status: "PENDING" },
    { createdBy: 0, lastUpdatedBy: 0 },
    { limit, skip: page * limit }
  );
  res.status(200).json({ success: true, data: { rider, limit, page } });
});
// export const ex = catchErrorFunc(async (req, res) => {});
