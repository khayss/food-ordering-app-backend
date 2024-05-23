import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config.js";

export async function verifyAdmin(req, res, next) {
  try {
    const payload = req.get("Authorization");
    const token = payload.split(" ")[1];
    const verifiedToken = await jwt.verify(token, jwtSecret);

    if (verifiedToken) {
      req.verifiedAdmin = verifiedToken;
      next();
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Cannot verify token. token is invalid or expired",
    });
  }
}
export async function verifyRider(req, res, next) {
  try {
    const payload = req.get("Authorization");
    const token = payload.split(" ")[1];
    const verifiedToken = await jwt.verify(token, jwtSecret);

    if (verifiedToken) {
      req.verifiedRider = verifiedToken;
      next();
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Cannot verify token. token is invalid or expired",
    });
  }
}
export async function verifyUser(req, res, next) {
  try {
    const payload = req.get("Authorization");
    const token = payload.split(" ")[1];
    const verifiedToken = await jwt.verify(token, jwtSecret);

    if (verifiedToken) {
      req.verifiedUser = verifiedToken;
      next();
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Cannot verify token. token is invalid or expired",
    });
  }
}
