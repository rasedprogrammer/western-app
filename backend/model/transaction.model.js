const mongo = require("mongoose");
const { Schema } = mongo;

const transactionSchema = new Schema(
  {
    paxName: String,
    paxNumber: {
      type: String,
      default: "",
    },
    issueDate: Date,
    flightDate: {
      type: Date,
      default: null,
    },
    sector: {
      type: String,
      default: "",
    },
    airline: {
      type: String,
      default: "",
    },
    pnr: {
      type: String,
      default: "",
    },
    sellOrBuy: {
      type: String,
      default: "",
    },
    transactionType: String,
    transactionAmount: Number,
    reference: String,
    currentBalance: Number,
    accountNo: Number,
    branch: String,
    fullname: String,
    key: String,
    customerId: String,
  },
  { timestamps: true }
);

module.exports = mongo.model("transaction", transactionSchema);
