const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const userSchema = require("../model/users.model");

router.post("/", (req, res) => {
  controller.createData(req, res, userSchema);
});

module.exports = router;
