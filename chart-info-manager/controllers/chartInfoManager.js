const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/custom-errors");
const Chart = require("../models/Chart");

require("express-async-error");

/**
 * @description controller gets an email and returns all the charts that are owned by that user
 * @param {JSON} req.params {email: String}
 * @param {JSON} res {success: Bool, result: Obj} 
 * Obj = {email:String, chart_url: String, chart_type: String, chart_name: String, created_at: timestamp, format_type: String}
 */
const userChartsInfo = async (req, res) => {
  const email = req.params.email;
  if (!email) {
    throw new BadRequest("Email parameter is mandatory in get request");
  }

  try {
    let charts = await Chart.find({ email }).select("-_id -__v");
    charts = Array.from(charts);
    if (charts.length === 0) {
      throw new NotFound(
        `Didn't find any resources for user with email:${email}...`
      );
    }

    res.status(StatusCodes.OK).json({ success: true, result: charts });
  } catch (error) {
    res.status(error.status).json({ success: false, message: error.msg });
  }
};

module.exports = userChartsInfo;
