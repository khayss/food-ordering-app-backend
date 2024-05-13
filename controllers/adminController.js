import { validateAdminSignupReqBody } from "../utils/adminValidators.js";
import { catchErrorFunc } from "../utils/catchErrorFunc.js";

/*  controller for handling admin signup logic */
export const adminSignupController = catchErrorFunc(async (req, res) => {
  validateAdminSignupReqBody(req.body);

  res.send("ok");
});

/* controller for handling admin login */
export const adminLoginController = catchErrorFunc(async (req, res) => {});
