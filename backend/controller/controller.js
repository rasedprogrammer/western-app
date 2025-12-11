const { schema } = require("../model/transaction.model");
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

const filterData = async (req, res, schema) => {
  try {
    let {
      fromDate,
      toDate,
      accountNo,
      fullname,
      accountType,
      flightDate,
      branch,
      page = 1,
      pageSize = 10,
    } = req.body;

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const query = {
      issueDate: { $gte: startDate, $lte: endDate },
    };

    if (branch) query.branch = branch;

    // Account Number check
    if (accountNo && String(accountNo).trim() !== "") {
      query.accountNo = Number(accountNo);
    }

    // Fullname check (case-insensitive)
    if (fullname && fullname.trim() !== "") {
      query.fullname = new RegExp(fullname, "i");
    }

    if (accountType && accountType.trim() !== "") {
      query.accountType = accountType;
    }

    if (flightDate && flightDate.trim() !== "") {
      const fDate = new Date(flightDate);
      fDate.setHours(0, 0, 0, 0);

      const fEnd = new Date(flightDate);
      fEnd.setHours(23, 59, 59, 999);

      query.flightDate = { $gte: fDate, $lte: fEnd };
    }

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      schema.find(query).skip(skip).limit(pageSize),
      schema.countDocuments(query),
    ]);

    res.status(200).json({
      message: "Filtered Successfully",
      success: true,
      data,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
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

    const dbRes = await dbService.findOneRecord(query, schema);

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
  const { branch, accountNo } = req.query;
  let matchStage = {};
  if (branch) matchStage.branch = branch;
  if (accountNo) matchStage.accountNo = Number(accountNo);
  try {
    const summary = await schema.aggregate([
      {
        $match: matchStage,
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

const getPaginatedTransactions = async (req, res, schema) => {
  try {
    const { accountNo, branch, page = 1, pageSize = 10 } = req.query;

    const filter = {};
    if (accountNo) filter.accountNo = accountNo;
    if (branch) filter.branch = branch;

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const [transactions, total] = await Promise.all([
      schema
        .find(filter)
        .sort({ createdAt: -1 }) // Optional: newest first
        .skip(skip)
        .limit(limit),
      schema.countDocuments(filter),
    ]);

    res.status(200).json({
      data: transactions,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

module.exports = {
  createData,
  filterData,
  getData,
  updateData,
  deleteData,
  findByAccountNo,
  getTransactionSummary,
  getPaginatedTransactions,
};
