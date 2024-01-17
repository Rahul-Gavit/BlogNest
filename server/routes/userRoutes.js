const express = require("express");
const {
  getAllUsers,
  registerController,
  loginController,
} = require("../controllers/userController");

const router = express.Router();

//Get All Users || GET
router.get("/all-users", getAllUsers);

// Create User || POST
router.post("/signup", registerController);

//Login User || POST
router.post("/login", loginController);

module.exports = router;
