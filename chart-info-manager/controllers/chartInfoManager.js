require('express-async-error');

const userChartsInfo = (req, res) => {
    res.status(200).send("app is working")
};

module.exports = userChartsInfo;