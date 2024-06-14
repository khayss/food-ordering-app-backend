import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { apiPrefixes, port } from "./config/config.js";
import { connectDB } from "./database/db.js";
import { adminRouter } from "./routes/adminRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { riderRouter } from "./routes/riderRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { generalRouter } from "./routes/generalRoutes.js";

/* Initial express application */
const app = express();

/* Middlewares */
app
  .use(
    cors({
      origin: "https://food-app-front-end-sand.vercel.app",
      credentials: true,
    })
  )
  .use(morgan("dev")) // Logging requests and response
  .use(express.json()) // Parse incoming requests with JSON payload
  .use(express.urlencoded({ extended: true })) // Parses incoming requests with urlencoded payloads
  .use("/images", express.static("public"))

  /* Router for admin routes */
  .use(apiPrefixes.generalApi, generalRouter)
  .use(apiPrefixes.userApi, userRouter)
  .use(apiPrefixes.riderApi, riderRouter)
  .use(apiPrefixes.adminApi, adminRouter)
  .use("*", (req, res) =>
    res.status(404).json({
      status: "error",
      message: "route not found",
    })
  )

  /* Error handler middlewares */
  .use(errorHandler);

/* Connect to database and Listen for requests using an IIFE*/
(async function () {
  await connectDB();
  app.listen(port, () => {
    console.log(`server is listening on ${port}`);
  });
})();
