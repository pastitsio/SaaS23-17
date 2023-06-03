const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors())


app.get('/user/:userId', (req, res) => {
  res.status(200).json({
    new_user: true,
    _id: req.params.userId,
    email: 'demos@testos.com',
    number_of_charts: 0,
    credits: 0,
    last_login: 1682970603153
  })
})


app.get('/preset/:presetId', (req, res) => {
  // Extract the JWT token from the request headers
  const presetId = req.params.presetId;
  const filename = `./test${presetId}.json`;

  fs.readFile(filename, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Error reading data file'
      });
      return;
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});


app.get('/chart/:id', (req, res) => {
  // const chartId = req.params.chartId;
  // const format = req.query.format || 'png'; // default to PNG if not specified
  // const preview = req.query.format || true; // default to preview if not specified

  const chartId = 'e';
  const format = 'png';
  const preview = true;

  if (!['png', 'jpg', 'jpeg'].includes(format)) {
    console.error('Unsupported format!');
    res.status(500).json({
      success: false,
      message: 'Unsupported format!'
    });
    return;
  }

  const filePath = `${chartId}.${format}`;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(404).json({
        success: false,
        message: 'Image not found'
      });
      return;
    }
    const base64image = Buffer.from(data).toString('base64');

    console.log('Image served!')
    res.set('Content-Type', 'image/png');
    res.status(200).send(data);
  });
});


app.get('/charts/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const tableData = [
    { 'id': 'a', 'type': 'linear', 'name': 'chart_a', 'createdTimestamp': 1131482603153 },
    { 'id': 'b', 'type': 'linear', 'name': 'chart_b', 'createdTimestamp': 1231482603153 },
    { 'id': 'c', 'type': 'linear', 'name': 'chart_c', 'createdTimestamp': 1141482603153 },
    { 'id': 'd', 'type': 'linear', 'name': 'chart_d', 'createdTimestamp': 1241482603153 },
    { 'id': 'e', 'type': 'linear', 'name': 'chart_f', 'createdTimestamp': 1251482603153 },
    { 'id': 'f', 'type': 'linear', 'name': 'chart_g', 'createdTimestamp': 1261482603153 },
    { 'id': 'g', 'type': 'linear', 'name': 'chart_h', 'createdTimestamp': 1231482503153 },
    { 'id': 'h', 'type': 'linear', 'name': 'chart_i', 'createdTimestamp': 1231482603153 },
    { 'id': 'i', 'type': 'linear', 'name': 'chart_j', 'createdTimestamp': 1231482603153 },
    { 'id': 'j', 'type': 'linear', 'name': 'chart_k', 'createdTimestamp': 1231482603153 },
    { 'id': 'k', 'type': 'linear', 'name': 'chart_l', 'createdTimestamp': 1231482603153 },
    { 'id': 'l', 'type': 'linear', 'name': 'chart_m', 'createdTimestamp': 1231482603153 },
  ]

  res.status(200).send(tableData);
});


app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
