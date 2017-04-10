const express = require('express');

const app = express();

app.set('view engine', 'ejs'); // Render all html via ejs

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(3004, function () {
  console.log('Example app listening on port 3004!');
});
