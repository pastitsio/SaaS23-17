

require('express-async-errors');

/**
 *
 * @param {*} req
 * @param {*} res
 */

const purchase = (req, res) => {
  res.send("purchase ok");
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const udpate = (req, res) => {
  res.send("update ok");
};

module.exports = { purchase, udpate };
