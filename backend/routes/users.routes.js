const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const userSchema = require("../model/users.model");

router.get("/", (req, res) => {
  controller.getData(req, res, userSchema);
});

router.post("/", (req, res) => {
  controller.createData(req, res, userSchema);
});

router.put("/:id", (req, res) => {
  controller.updateData(req, res, userSchema);
});

module.exports = router;
