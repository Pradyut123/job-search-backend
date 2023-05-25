import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import jobRoute from "./routes/jobRoute.js";
import jobTypeRoute from "./routes/jobTypeRoute.js";

// require("./db/connection");

const app = express();
dotenv.config();

//MongoDB connection
const DB = process.env.DATABASE;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB)
  .then(() => {
    console.log(`connection Successful`);
  })
  .catch((error) => console.log(`not connected`));

//middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
// Log incoming requests with Morgan
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "5mb",
    extended: true,
  })
);

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", jobTypeRoute);
app.use("/api", jobRoute);

// error middleware
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
