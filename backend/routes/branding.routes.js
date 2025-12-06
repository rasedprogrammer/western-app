const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const brandingSchema = require("../model/branding.model");
const { verifyToken, isAdmin } = require("../middlewares/middleware");

router.get("/", verifyToken, isAdmin, (req, res) => {
  controller.getData(req, res, brandingSchema);
});

router.post("/", verifyToken, isAdmin, (req, res) => {
  controller.createData(req, res, brandingSchema);
});

router.put("/:id", verifyToken, isAdmin, (req, res) => {
  controller.updateData(req, res, brandingSchema);
});

module.exports = router;
