require("dotenv").config();
const mongoose = require("mongoose");

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Find all records
const findAllRecord = async (schema) => {
  try {
    return await schema.find();
  } catch (err) {
    console.error("Error finding records:", err);
    throw err;
  }
};
// ✅ Find One records
const findOneRecord = async (query, schema) => {
  try {
    return await schema.findOne(query);
  } catch (err) {
    console.error("Error finding records:", err);
    throw err;
  }
};

// ✅ Create new record
const createNewRecord = async (data, schema) => {
  try {
    const dbRes = await schema.create(data);
    return dbRes;
  } catch (err) {
    console.error("Error creating record:", err);
    throw err;
  }
};

// ✅ Update record
const updateRecord = async (id, data, schema) => {
  try {
    const dbRes = await schema.findByIdAndUpdate(id, data, { new: true });
    return dbRes;
  } catch (err) {
    console.error("Error updating record:", err);
    throw err;
  }
};

// ✅ Delete record
const deleteRecord = async (id, schema) => {
  try {
    const dbRes = await schema.findByIdAndDelete(id);
    return dbRes;
  } catch (err) {
    console.error("Error deleting record:", err);
    throw err;
  }
};

// ✅ Correct export
module.exports = {
  findAllRecord,
  findOneRecord,
  createNewRecord,
  updateRecord,
  deleteRecord,
};
