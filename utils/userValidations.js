import { z } from "zod";
import { AppError } from "./error.js";

export const userSignupSchema = z.object({
  firstname: z
    .string({
      invalid_type_error: "'firstname' field must be a string",
      required_error: "'firstname' field is required",
    })
    .trim()
    .toLowerCase()
    .min(2, {
      message:
        "'firstname' field value is too short. firstname should have at least 2 characters",
    })
    .max(50, {
      message:
        "'firstname' field value is too long. firstname must be under 50 characters",
    }),
  lastname: z
    .string({
      invalid_type_error: "'lastname' field must be a string",
      required_error: "'lastname' field is required",
    })
    .trim()
    .toLowerCase()
    .min(2, {
      message:
        "'lastname' field is too short. lastname should have at least 2 characters",
    })
    .max(50, {
      message:
        "'lastname' field is too long. lastname must be under 50 characters",
    }),
  email: z
    .string({
      invalid_type_error: "an email is required for this field",
      required_error: "an email is required to register user",
    })
    .trim()
    .toLowerCase()
    .email({ message: "an email is required for this field" }),
  password: z
    .string({ required_error: "password field is required" })
    .trim()
    .min(8, { message: "password too short. must be 8 characters or more" })
    .max(100, { message: "password is limitted to 100 characters" }),
  address: z
    .string({ required_error: "'address' field is required for registration" })
    .trim()
    .max(255, "'address' field is too long"),
  tel: z.number({
    required_error: "Required field: tel field cannot be null",
    invalid_type_error: "Invalid type: phone number must be a number",
    coerce: true,
  }),
});

export const userLoginSchema = z.object({
  email: z
    .string({ required_error: "email is required to sign in" })
    .trim()
    .toLowerCase()
    .email("Invalid Email"),
  password: z
    .string({ required_error: "password is required to sign in" })
    .trim()
    .min(8, {
      message: "password is too short. must be 8 characters or longer",
    }),
});

/* VALIDATORS */

// user sign up req body validator
export function validateUserSignupReqBody(data) {
  const result = userSignupSchema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    const details = result.error.issues.map((issue) => issue.message);
    throw new AppError("1000", 400, "ValidationError", details[0], details);
  }
}

// user login req body validator
export function validateUserLoginReqBody(data) {
  const result = userLoginSchema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    const details = result.error.issues.map((issue) => issue.message);
    throw new AppError("1001", 400, "ValidationError", details[0], details);
  }
}
