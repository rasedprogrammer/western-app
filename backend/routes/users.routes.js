const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const userSchema = require("../model/users.model");
const {
  verifyToken,
  isAdmin,
  isAdminEmployee,
} = require("../middlewares/middleware");

router.get("/", verifyToken, isAdmin, (req, res) => {
  controller.getData(req, res, userSchema);
});

router.post("/", verifyToken, (req, res) => {
  controller.createData(req, res, userSchema);
});

router.put("/:id", verifyToken, isAdmin, (req, res) => {
  controller.updateData(req, res, userSchema);
});

router.delete("/:id", verifyToken, isAdmin, (req, res) => {
  controller.deleteData(req, res, userSchema);
});

module.exports = router;
