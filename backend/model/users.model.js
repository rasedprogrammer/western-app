const mongo = require("mongoose");
const bcryp = require("bcrypt");
const { Schema } = mongo;

const usersSchema = new Schema(
  {
    fullname: String,
    mobile: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    profile: String,
    address: String,
    userType: String,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Password Brcypt Hash Functionality
usersSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = await bcryp.genSalt(10);
  user.password = await bcryp.hash(user.password, salt);
});

module.exports = mongo.model("user", usersSchema);
