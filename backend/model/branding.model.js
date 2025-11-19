const mongo = require("mongoose");
const bcryp = require("bcrypt");
const { Schema } = mongo;

const brandingSchema = new Schema(
  {
    bankName: String,
    bankTagLine: String,
    bankLogo: String,
    bankAccountNo: String,
    bankTransactionId: String,
    bankAddress: String,
    fullname: String,
    email: String,
    password: String,
    bankLinkedin: String,
    bankTwitter: String,
    bankFacebook: String,
    bankDesc: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongo.model("branding", brandingSchema);
