const dbService = require("../services/db.service");

const createData = async (req, res, schema) => {
  try {
    const data = req.body;
    const dbRes = await dbService.createNewRecord(data, schema);
    res.status(200).json({
      message: "Data Inserted Successfully",
      success: true,
      data: dbRes,
    });
  } catch (error) {
    // Check if it's a duplicate key error
    if (error.code === 11000) {
      return res.status(422).json({
        message: "Duplicate field value entered",
        success: false,
        error,
      });
    }

    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createData,
};
