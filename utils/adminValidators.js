import { AdminError } from "../errors/adminError.js";
import { adminSignupSchema } from "./adminValidationSchemas.js";

export function validateAdminSignupReqBody(body) {
  const result = adminSignupSchema.safeParse(body);
  if (result.success) {
    return result.data;
  } else {
    const details = result.error.issues.map((issue) => issue.message);
    throw new AdminError(
      "ADERVA-001",
      400,
      "ValidationError",
      "Incomplete or invalid sign up body",
      details
    );
  }
}
