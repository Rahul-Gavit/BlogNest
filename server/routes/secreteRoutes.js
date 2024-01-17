const express = require("express");
const {
  getAllSecreteController,
  createSecreteController,
  updateSecreteController,
  getSecreteByIdController,
  deleteSecreteController,
  userSecreteController,
} = require("../controllers/secreteController");
const jwtMiddleware = require("../middlewares");

const router = express.Router();

//GET || all secrete
router.get("/all-secrete", getAllSecreteController);

//POST || create secrete
router.post("/create-secrete", jwtMiddleware, createSecreteController);

//PUT || update secrete
router.put("/update-secrete/:id", jwtMiddleware, updateSecreteController);

//GET || delete secrete
router.delete("/delete-secrete/:id", jwtMiddleware, deleteSecreteController);

//GET || single secrete details
// router.get("/get-secrete/:id", jwtMiddleware, getSecreteByIdController);

//GET || user secrete
// router.get("/user-secrete/:id", userSecreteController);

module.exports = router;
