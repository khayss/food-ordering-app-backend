import { jwtSecret } from "../config/config.js";
import { AdminError } from "../errors/adminError.js";
import { AdminModel } from "../models/adminModel.js";
import {
  validateAdminLoginReqBody,
  validateAdminSignupReqBody,
} from "../utils/adminValidators.js";
import { catchErrorFunc } from "../utils/catchErrorFunc.js";
import { createHash } from "../utils/hash.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ADMIN SIGNUP CONTROLLER */
export const adminSignupController = catchErrorFunc(async (req, res) => {
  /* function returns validated admin details or throws an error if validation fails */
  const { email, firstname, lastname, password, tel } =
    validateAdminSignupReqBody(req.body);

  /* check if admin with same email already exists in the database */
  const adminExist = await AdminModel.findOne({ email });
  if (adminExist)
    throw new AdminError(
      "1100",
      409,
      "SIGNUP",
      "Duplicate Registration. Email already in use",
      `Email '${email}' is already in use. Only one account can be registered under the same email`
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
  });

  res
    .status(201)
    .json({ success: true, message: "Admin created successfully" });
});

/* ADMIN LOGIN CONTROLLER */
export const adminLoginController = catchErrorFunc(async (req, res) => {
  const jwtExpiration = 24 * 60 * 60;

  /* function returns validated admin details or throws an error if validation fails */
  const { email, password } = validateAdminLoginReqBody(req.body);

  /* check if admin with same email already exists in the database */
  const admin = await AdminModel.findOne({ email });
  if (!admin)
    throw new AdminError(
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
    throw new AdminError(
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
        throw new AdminError(
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
