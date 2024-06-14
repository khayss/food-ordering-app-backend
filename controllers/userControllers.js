import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/userModel.js";
import { catchErrorFunc } from "../utils/catchErrorFunc.js";
import { AppError } from "../utils/error.js";
import { createHash } from "../utils/hash.js";
import {
  validateUserLoginReqBody,
  validateUserSignupReqBody,
} from "../utils/userValidations.js";
import { jwtExpiration, jwtSecret } from "../config/config.js";
import { validateOrderReqBody } from "../utils/orderValidations.js";
import { FoodModel } from "../models/foodModel.js";
import { OrderModel } from "../models/orderModel.js";
import { DeliveryModel } from "../models/deliveryModel.js";

export const userSignupController = catchErrorFunc(async (req, res) => {
  /* function returns validated user details or throws an error if validation fails */
  const { email, firstname, lastname, password, tel, address } =
    validateUserSignupReqBody(req.body);

  /* get the file path from req.file made available by multer */
  const photoPath = req.file?.path;

  /* check if user with same email or phone number already exists in the database */
  const userExist = await UserModel.findOne({ $or: [{ email }, { tel }] });

  if (userExist && userExist.email == email)
    throw new AppError(
      "1100",
      409,
      "SIGNUP",
      "Duplicate Registration. Email already in use",
      `Email '${email}' is already in use. Only one account can be registered under the same email`
    );

  /* check if user with the same tel exist */
  if (userExist && userExist.tel == tel)
    throw new AppError(
      "1101",
      409,
      "SIGNUP",
      "Phone number already in use",
      `Phone number '${tel}' is already in use. Each account must have a unique phone number`
    );

  /* create a hash of the password */
  const encryptedPassword = await createHash(password);

  /* create a new user document and save it to the database */
  const newUser = await UserModel.create({
    email,
    firstname,
    lastname,
    password: encryptedPassword,
    tel,
    profilePicture: photoPath,
    address,
  });

  res.status(201).json({ success: true, message: "User created successfully" });
});

/* Login user controller */
export const userLoginController = catchErrorFunc(async (req, res) => {
  /* vaidate and get req body for login if validated */
  const { email, password } = validateUserLoginReqBody(req.body);

  /* check if user with same email already exists in the database */
  const user = await UserModel.findOne({ email });
  if (!user)
    throw new AppError(
      "1101",
      404,
      "LOGIN",
      "user account not found",
      `user account with email '${email}' not found`
    );

  /* get encrypted password to compare */
  const encryptedPassword = user.password;

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
  /* destructure user data from database separating the password */
  const { password: userPassword, ...userDetails } = user.toJSON();

  /* sign and generate a jwt token for authentication */
  jwt.sign(
    {
      email,
      id: userDetails._id,
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
          "server encountered an error sigining in user"
        );
      res.status(200).json({ success: true, userDetails, userToken: token });
    }
  );
});

/* GET LOGGEDIN user CONTROLLER  */
export const getUser = catchErrorFunc(async (req, res) => {
  const { id } = req.verifiedUser;

  const loggedInUser = await UserModel.findById(id);
  const { password, ...userDetails } = loggedInUser.toJSON();
  res.status(200).json({
    success: true,
    userDetails,
  });
});

/* NEW FOOD ORDER CONTROLLER */
export const createOrder = catchErrorFunc(async (req, res) => {
  const { deliveryAddress, foodId, quantity } = validateOrderReqBody(req.body);

  const food = await FoodModel.findById(foodId);

  if (!food)
    throw new AppError(
      "1201",
      404,
      "ORDER",
      "Food Not Found",
      "food with the given id was not found"
    );
  if (food.stock == 0 || food.stock - quantity < 0)
    throw new AppError(
      "1202",
      404,
      "ORDER",
      "Food out of stock",
      "This food is out of stock"
    );

  const updatedFood = await FoodModel.findByIdAndUpdate(
    foodId,
    {
      $inc: {
        stock: -quantity,
      },
    },
    { new: true }
  );

  if (updatedFood.stock < 0) {
    await FoodModel.findByIdAndUpdate(foodId, { $inc: { stock: quantity } });
    throw new AppError(
      "1203",
      400,
      "ORDER",
      "Food out of stock",
      "This food is out of stock"
    );
  }

  const { id: userId } = req.verifiedUser;

  const order = await OrderModel.create({
    food: foodId,
    quantity,
    deliveryAddress,
    orderBy: userId,
    pricePaidInCents: food.priceInCents,
  });

  await DeliveryModel.create({
    order: order._id,
    status: "PENDING",
  });

  res.status(201).json({
    success: true,
    data: {
      order: order.toJSON(),
    },
  });
});

export const getDeliveryStatus = catchErrorFunc(async (req, res) => {
  const { id: deliveryId } = req.params;

  const delivery = await DeliveryModel.findById(deliveryId);

  if (!delivery)
    throw new AppError(
      "1204",
      404,
      "DELIVERY",
      "Delivery not found",
      "This delivery was not found"
    );

  res.status(200).json({
    success: true,
    data: {
      delivery: delivery.toJSON(),
    },
  });
});

export const getOrder = catchErrorFunc(async (req, res) => {
  const { id: orderId } = req.query;

  const order = await OrderModel.findById(orderId);

  if (!order)
    throw new AppError(
      "1204",
      404,
      "ORDER",
      "Order not found",
      "This Order was not found"
    );

  res.status(200).json({
    success: true,
    data: {
      order: order.toJSON(),
    },
  });
});

export const getOrders = catchErrorFunc(async (req, res) => {
  const { id } = req.verifiedUser;

  console.log(id);

  const order = await OrderModel.find(
    { orderBy: id },
    { rider: 0 },
    { limit: 10 }
  ).populate("food");
  if (order.length < 1)
    throw new AppError(
      "1204",
      404,
      "This user hasn't made any other yet",
      "No orders found"
    );

  res.status(200).json({
    success: true,
    message: "user orders successfully retrieved",
    data: order,
  });
});
