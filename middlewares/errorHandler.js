import { MulterError } from "multer";
import { AppError } from "../utils/error.js";
import fsPromises from "fs/promises";

export function errorHandler(error, req, res, next) {
  console.log(error);

  const success = false;

  if (req.file) {
    fsPromises.rm(req.file.path, { force: true });
  }
  if (req.files && req.files.length > 1) {
    req.files.forEach((element) => {
      fsPromises.rm(element.path);
    });
  }

  if (error instanceof AppError) {
    res.status(error.responseCode).json({
      success,
      message: error.message,
    });
  } else if (error instanceof MulterError) {
    res.status(400).json({ success, message: error.message });
  } else {
    res.status(500).json({ success, message: "Server Error" });
  }
}
