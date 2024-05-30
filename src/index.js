const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRoute = require("./routes/auth.js");
const todoRoute = require("./routes/todo.js");

const app = express();

dotenv.config();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.URL_DB)
  .then(() => console.log("DB connect successfully"))
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: "*",
    credentials: true,
    origin: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/todo", todoRoute);

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
