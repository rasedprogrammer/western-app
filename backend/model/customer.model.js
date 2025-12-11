const mongo = require("mongoose");
const { Schema } = mongo;

const customerSchema = new Schema(
  {
    accountNo: Number,
    fullname: String,
    email: {
      type: String,
      unique: true,
    },
    key: String,
    profile: String,
    accountType: String,
    finalBalance: {
      type: Number,
      default: 0,
    },
    address: String,
    userType: String,
    branch: String,
    createBy: String,
    customerLoginId: String,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongo.model("customer", customerSchema);
