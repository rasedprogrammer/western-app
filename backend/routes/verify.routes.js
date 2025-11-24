const express = require("express");
const router = express.Router();
const tokenService = require("../services/token.service");

router.get("/", async (req, res) => {
  const verified = await tokenService.verifyToken(req, res);
  if (verified.isVerified) {
    return res.status(200).json({
      message: "Token is valid",
      data: verified.data,
      isVerified: true,
    });
  } else {
    return res.status(401).json({
      message: "Token is invalid",
      isVerified: false,
    });
  }
});

module.exports = router;
