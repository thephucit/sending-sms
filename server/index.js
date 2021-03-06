'use strict';
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');

const app = express();
const server = app.listen(4000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

// Nexmo init
const nexmo = new Nexmo({
  apiKey: config.api_key,
  apiSecret: config.api_secret,
}, {debug: true});

// Configure Express
app.set('views', __dirname + '/../views');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  res.send(req.body);
  let toNumber = req.body.number;
  let text = req.body.text;
  let data = {}; // the data to be emitted to front-end
  // Sending SMS via Nexmo
  nexmo.message.sendSms(
    config.number, toNumber, text, {type: 'unicode'},
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
      }
    }
  );
});
