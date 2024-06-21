import multer from "multer";
import { AppError } from "../utils/error.js";
import path from "path";

/* multer storage for admin signup */
const adminSignupStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/uploads/admin");
  },
  filename: async (req, file, cb) => {
    try {
      const { firstname, lastname } = req.body;
      const uniqueSuffix = Date.now() + (Math.random() * 1e16).toFixed();
      const extensionName = path.extname(file.originalname);
      const newFileName =
        firstname + "-" + lastname + "-" + uniqueSuffix + extensionName;
      cb(null, newFileName);
    } catch (error) {
      cb(error, "");
    }
  },
});

/* Multer middleware for admin signup */
export const adminSignupUpload = multer({
  storage: adminSignupStorage,
  limits: {
    files: 1,
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter(req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          "ADERFL1001",
          400,
          "FILE",
          "Invalid image type",
          "Unsupported image or file format. only accepts jpeg, jpg, png images"
        )
      );
    }
  },
}).single("photo");

/* Multer storage for new food */
const createFoodStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/uploads/food");
  },
  filename: async (req, file, cb) => {
    try {
      const uniqueSuffix = Date.now() + (Math.random() * 1e16).toFixed();
      const extensionName = path.extname(file.originalname);
      const newFileName = "food-" + uniqueSuffix + extensionName;
      cb(null, newFileName);
    } catch (error) {
      cb(error, "");
    }
  },
});

/* Multer middleware for new food */
export const createFoodUlpoad = multer({
  storage: createFoodStorage,
  limits: { files: 5, fileSize: 1024 * 1024 * 3 },
  fileFilter(req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          "ADERFL1001",
          400,
          "FILE",
          "Invalid image type",
          "Unsupported image or file format. only accepts jpeg, jpg, png images"
        )
      );
    }
  },
}).array("images[]", 5);

const userSignupStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/uploads/users");
  },
  filename: async (req, file, cb) => {
    try {
      const uniqueSuffix = Date.now() + (Math.random() * 1e16).toFixed();
      const extensionName = path.extname(file.originalname);
      const newFileName = "user-" + uniqueSuffix + extensionName;

      cb(null, newFileName);
    } catch (error) {
      cb(error, "");
    }
  },
});

export const userSignupUpload = multer({
  storage: userSignupStorage,
  limits: {
    files: 1,
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter(req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    )
      cb(null, true);
    else
      cb(
        new AppError(
          "ADERFL1001",
          400,
          "FILE",
          "Invalid image type",
          "Unsupported image or file format. only accepts jpeg, jpg, png images"
        ),
        false
      );
  },
}).single("photo");
