require("dotenv").config();
const dbService = require("../services/db.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../model/users.model");
const Customer = require("../model/customer.model");

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
          const db = await Customer.findOne(
            { email },
            { _id: 0, accountNo: 1 }
          );
          // Payload Define With Condition Start
          let payload = null;
          db
            ? (payload = {
                ...dbRes._doc,
                _id: dbRes._id.toString(),
                accountNo: db.accountNo,
              })
            : (payload = {
                ...dbRes._doc,
                _id: dbRes._id.toString(),
              });
          // Payload Define With Condition End

          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "3h",
          });
          return res.status(200).json({
            success: true,
            message: "Login Successful",
            isLoged: true,
            token,
            userType: dbRes._doc.userType,
          });
        } else {
          return res.status(401).json({
            success: false,
            message: "You are not active member. Please contact admin.",
            isLoged: false,
          });
        }
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
        isLoged: false,
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
