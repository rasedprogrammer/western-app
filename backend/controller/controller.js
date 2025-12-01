const dbService = require("../services/db.service");

const getData = async (req, res, schema) => {
  try {
    const dbRes = await dbService.findAllRecord(schema);
    return res.status(200).json({
      message: "Record Found !",
      success: true,
      data: dbRes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error,
    });
  }
};

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
      error,
    });
  }
};

const updateData = async (req, res, schema) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const dbRes = await dbService.updateRecord(id, data, schema);
    return res.status(200).json({
      message: "Record updated successfully!",
      success: true,
      data: dbRes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error,
    });
  }
};

const deleteData = async (req, res, schema) => {
  try {
    const { id } = req.params;
    const dbRes = await dbService.deleteRecord(id, schema);
    return res.status(200).json({
      message: "Record deleted successfully!",
      success: true,
      data: dbRes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error,
    });
  }
};

const findByAccountNo = async (req, res, schema) => {
  try {
    const query = req.body;
    console.log(query);

    const dbRes = await dbService.findOneRecord(query, schema);
    console.log(dbRes);

    return res.status(200).json({
      message: "Record Found!!",
      data: dbRes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error !",
      success: false,
    });
  }
};

module.exports = {
  createData,
  getData,
  updateData,
  deleteData,
  findByAccountNo,
};
