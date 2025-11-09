const express = require("express");
const router = express.Router();

router.post("/", (_, res) => {
  res.status(200).json({
    message: "User Requested!!!",
  });
});

module.exports = router;
