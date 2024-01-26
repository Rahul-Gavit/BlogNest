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
const blogRoute = require("./routes/blogRoutes");

//middlewares
app.use(cors());
app.use(express.json());
// routes

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoute);

app.listen(port, () => {
  console.log(`server connected to port ${port}`);
});
