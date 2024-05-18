import { AdminError } from "../errors/adminError.js";
import {
  adminLoginSchema,
  adminSignupSchema,
} from "./adminValidationSchemas.js";

export function validateAdminSignupReqBody(data) {
  const result = adminSignupSchema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    const details = result.error.issues.map((issue) => issue.message);
    throw new AdminError(
      "1000",
      400,
      "ValidationError",
      "Incomplete or invalid sign up body",
      details
    );
  }
}

export function validateAdminLoginReqBody(data) {
  const result = adminLoginSchema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    const details = result.error.issues.map((issue) => issue.message);
    throw new AdminError(
      "1001",
      400,
      "ValidationError",
      "Incomplete or invalid login body",
      details
    );
  }
}
