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

const getTransactionSummary = async (req, res, schema) => {
  const { branch } = req.query;
  try {
    const summary = await schema.aggregate([
      {
        $match: { branch },
      },
      {
        $group: {
          _id: null,
          totalCredit: {
            $sum: {
              $cond: [
                { $eq: ["$transactionType", "cr"] },
                "$transactionAmount",
                0,
              ],
            },
          },
          totalDebit: {
            $sum: {
              $cond: [
                { $eq: ["$transactionType", "dr"] },
                "$transactionAmount",
                0,
              ],
            },
          },
          totalCreditTransactions: {
            $sum: {
              $cond: [{ $eq: ["$transactionType", "cr"] }, 1, 0],
            },
          },
          totalDebitTransactions: {
            $sum: {
              $cond: [{ $eq: ["$transactionType", "dr"] }, 1, 0],
            },
          },
          totalTransactions: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalCredit: 1,
          totalCreditTransactions: 1,
          totalDebit: 1,
          totalDebitTransactions: 1,
          totalTransactions: 1,
          balance: {
            $subtract: ["$totalCredit", "$totalDebit"],
          },
        },
      },
    ]);
    if (summary.length === 0) {
      return res.status(403).json({
        message: "No matching transaction found!",
        error,
      });
    }
    res.status(200).json(summary[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error Calculating Summary",
      error,
    });
  }
};

module.exports = {
  createData,
  getData,
  updateData,
  deleteData,
  findByAccountNo,
  getTransactionSummary,
};
