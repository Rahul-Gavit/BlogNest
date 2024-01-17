const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

//env config
dotenv.config();

//mongodb connection
connectDB();

//router import
const userRoutes = require("./routes/userRoutes");
const secreteRoute = require("./routes/secreteRoutes");

//middlewares
app.use(cors());
app.use(express.json());
// routes

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/secrete", secreteRoute);

app.listen(port, () => {
  console.log(`server connected to port ${port}`);
});
