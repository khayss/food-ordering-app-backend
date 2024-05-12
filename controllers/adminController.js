import { catchErrorFunc } from "../utils/catchErrorFunc.js";

/*  controller for handling admin signup logic */
export const adminSignupController = catchErrorFunc(async (req, res) => {
  res.send("hello");
});

/* controller for handling admin login */
export const adminLoginController = catchErrorFunc(async (req, res) => {});
