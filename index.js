var express = require('express');
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world');
});

app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === '<validation_token>') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});
