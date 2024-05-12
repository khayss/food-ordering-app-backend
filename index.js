import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { apiPrefixes, port } from "./config/config.js";
import { connectDB } from "./database/db.js";
import { adminRouter } from "./routes/adminRoutes.js";

/* Initial express application */
const app = express();

/* Middlewares */
app.use(morgan("dev")); // Logging requests and response
app.use(express.json()); // Parse incoming requests with JSON payload
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with urlencoded payloads

/* router for admin routes */
app.use(apiPrefixes.adminApi, adminRouter);

/* Connect to database and Listen for requests using an IIFE*/
(async function () {
  await connectDB();
  app.listen(port, () => {
    console.log(`server is listening on ${port}`);
  });
})();
