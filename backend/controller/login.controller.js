require("dotenv").config();
const dbService = require("../services/db.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../model/users.model");

const loginFunc = async (req, res, schema) => {
  try {
    const { email, password } = req.body;
    const query = {
      email,
    };
    const dbRes = await dbService.findOneRecord(query, schema);
    if (dbRes) {
      const isMatch = await bcrypt.compare(password, dbRes.password);
      if (isMatch) {
        if (dbRes.isActive) {
          delete dbRes._doc.password;
          const payload = {
            ...dbRes._doc,
            _id: dbRes._id.toString(),
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "3h",
          });
          return res.status(200).json({
            success: true,
            message: "Login Successful",
            isLoggedIn: true,
            token,
            userType: dbRes._doc.userType,
          });
        } else {
          return res.status(401).json({
            success: false,
            message: "You are not active member. Please contact admin.",
            isLoggedIn: false,
          });
        }
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
        isLoggedIn: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      isLogedIn: false,
      error,
    });
  }
};

module.exports = {
  loginFunc,
};
