import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtExpiration, jwtSecret } from "../config/config.js";
import { RiderModel } from "../models/riderModel.js";
import { catchErrorFunc } from "../utils/catchErrorFunc.js";
import { AppError } from "../utils/error.js";
import { createHash } from "../utils/hash.js";
import {
  riderLoginSchema,
  riderSignUpSchema,
  validateRiderReqBody,
} from "../utils/riderValidations.js";
import { DeliveryModel } from "../models/deliveryModel.js";

export const signupRider = catchErrorFunc(async (req, res) => {
  const { address, email, firstname, lastname, password, tel } =
    validateRiderReqBody(req.body, riderSignUpSchema);

  /* check if rider with same email or phone number already exists in the database */
  const riderExist = await RiderModel.findOne({ $or: [{ email }, { tel }] });

  if (riderExist && riderExist.email == email)
    throw new AppError(
      "1100",
      409,
      "RIDER",
      "Duplicate Registration. Email already in use",
      `Email '${email}' is already in use. Only one account can be registered under the same email`
    );

  /* check if rider with the same tel exist */
  if (riderExist && riderExist.tel == tel)
    throw new AppError(
      "1101",
      409,
      "RIDER",
      "Phone number already in use",
      `Phone number '${tel}' is already in use. Each account must have a unique phone number`
    );

  /* create a hash of the password */
  const encryptedPassword = await createHash(password);

  /* create a new rider document and save it to the database */
  const newRider = await RiderModel.create({
    address,
    email,
    availability: "UNAVAILABLE",
    firstname,
    lastname,
    tel,
    password: encryptedPassword,
  });

  res
    .status(201)
    .json({ success: true, message: "rider created successfully" });
});

export const loginRider = catchErrorFunc(async (req, res) => {
  const { email, password } = validateRiderReqBody(req.body, riderLoginSchema);

  /* check if rider with same email already exists in the database */
  const rider = await RiderModel.findOne({ email });
  if (!rider)
    throw new AppError(
      "1101",
      404,
      "LOGIN",
      "rider account not found",
      `rider account with email '${email}' not found`
    );

  /* get encrypted password to compare */
  const encryptedPassword = rider.password;

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

  if (rider.status == "PENDING")
    throw new AppError(
      "1103",
      406,
      "RIDER",
      "Rider account is not approved",
      "Rider account is not approved. Rider can only access their account after approval"
    );
  /* destructure rider data from database separating the password */
  const {
    password: riderPassword,
    approvedBy,
    ...riderDetails
  } = rider.toJSON();

  /* sign and generate a jwt token for authentication */
  jwt.sign(
    {
      email,
      id: riderDetails._id,
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
          "server encountered an error sigining in rider"
        );
      res
        .status(200)
        .json({ success: true, data: { riderDetails, riderToken: token } });
    }
  );
});

export const getRider = catchErrorFunc(async (req, res) => {
  const { id } = req.verifiedRider;

  const rider = await RiderModel.findById(id, { approvedBy: 0, password: 0 });

  res.status(200).json({
    success: true,
    data: {
      rider: rider.toJSON(),
    },
  });
});

export const getAllDeliveries = catchErrorFunc(async (req, res) => {
  const deliveries = await DeliveryModel.find({}, {}, { limit: 20 });

  res.status(200).json({ success: true, data: { deliveries } });
});

export const getDelivery = catchErrorFunc(async (req, res) => {
  const { id } = req.params;

  const delivery = await DeliveryModel.findById(id);

  res
    .status(200)
    .json({ success: true, data: { delivery: delivery.toJSON() } });
});

export const updateAvailability = catchErrorFunc(async (req, res) => {
  const { id } = req.verifiedRider;
  const { status } = req.params;

  const rider = await RiderModel.findById(id);

  if (rider.availability == "BUSY")
    throw new AppError(
      "1404",
      400,
      "RIDER",
      "Rider is busy",
      "Rider is currently busy and cannot update availability"
    );

  let availability;

  switch (status) {
    case 0:
      availability = "UNAVAILABLE";
      break;
    case 1:
      availability = "AVAILABLE";
      break;
    default:
      availability = "UNAVAILABLE";
      break;
  }
  const updatedAvailability = await RiderModel.findByIdAndUpdate(
    id,
    {
      availability,
    },
    { new: true }
  );

  console.log(updatedAvailability);

  res.status(201).json({
    success: true,
    data: {
      message: "rider availabilty updated",
      availability: updatedAvailability.availability,
    },
  });
});

export const pickUpDelivery = catchErrorFunc(async (req, res) => {
  const { id } = req.verifiedRider;
  const { deliveryId } = req.params;

  const rider = await RiderModel.findById(id);

  if (rider.availability != "AVAILABLE")
    throw new AppError(
      "1400",
      400,
      "RIDER",
      "Rider is not available",
      "Rider is not available"
    );
  const pickedDelivery = await DeliveryModel.findByIdAndUpdate(
    deliveryId,
    {
      status: "DISPATCHED",
      rider: id,
    },
    { new: true }
  );

  await RiderModel.findByIdAndUpdate(id, { availability: "BUSY" });
  console.log(pickedDelivery);

  res.status(201).json({
    success: true,
    data: {
      message: "delivery confirmed",
      data: {
        pickedDelivery: pickedDelivery.toJSON(),
      },
    },
  });
});

export const confirmDelivery = catchErrorFunc(async (req, res) => {
  const { deliveryId } = req.params;
  const { id } = req.verifiedRider;

  const confirmedDelivery = await DeliveryModel.findByIdAndUpdate(
    deliveryId,
    {
      status: "DELIVERED",
    },
    { new: true }
  );

  await RiderModel.findByIdAndUpdate(id, { availability: "AVAILABLE" });

  res.status(201).json({
    success: true,
    confirmedDelivery: confirmedDelivery.toJSON(),
  });
});

export const reportDeliveryFailure = catchErrorFunc(async (req, res) => {
  const { id } = req.verifiedRider;
  const { deliveryId } = req.params;

  const confirmedDelivery = await DeliveryModel.findByIdAndUpdate(
    deliveryId,
    {
      status: "FAILED",
    },
    { new: true }
  );

  await RiderModel.findByIdAndUpdate(id, { availability: "AVAILABLE" });

  res.status(201).json({
    success: true,
    confirmedDelivery: confirmedDelivery.toJSON(),
  });
});

export const ex = catchErrorFunc(async (req, res) => {});
