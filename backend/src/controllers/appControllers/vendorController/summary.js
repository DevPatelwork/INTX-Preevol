const mongoose = require('mongoose');

const summary = async (Model, req, res) => {
  try {
    const company = req.company;

    // Total vendors count
    const total = await Model.countDocuments({
      company: company._id,
      removed: false,
    });

    return res.status(200).json({
      success: true,
      result: {
        total,
      },
      message: 'Successfully fetched vendor summary',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error fetching vendor summary',
      error: error.message,
    });
  }
};

module.exports = summary;
