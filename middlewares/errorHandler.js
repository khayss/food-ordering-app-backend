import { AdminError } from "../errors/adminError.js";

export function errorHandler(error, req, res, next) {
  const success = false;

  console.log(error);

  if (error instanceof AdminError) {
    res.status(error.responseCode).json({
      success,
      message: error.message,
      type: error.type,
      details: error.details,
    });
  } else {
    res.status(500).json({ success, message: "Server Error" });
  }
}
