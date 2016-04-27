const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express();

const token = process.env.MESSENGER_TOKEN;

const DEFAULT_MSG = [
  'Rock!!!!!!!!!', 'I love you!', 'I hate you!', 'Good morning', 'Good night', 'Long time no see'];

// parse application/json
app.use(bodyParser.json());

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world');
});

app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;
    console.log(sender);
    if (event.message && event.message.text) {
      var text = event.message.text;
      // Handle a text message from this sender

      if (Math.floor(Math.random() * 2) === 1) {
        sendTextMessage(sender, DEFAULT_MSG[Math.floor(Math.random() * 6)]);
      } else {
        sendTextMessage(sender, "I don't know what is '" + text.substring(0, 200) + "' mean!!!");
      }
    }
  }
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000);
