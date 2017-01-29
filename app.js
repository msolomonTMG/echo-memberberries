'use strict';

const
  bodyParser = require('body-parser'),
  express = require('express'),
  echo = require('./echo'),
  https = require('https'),
  request = require('request');

var app = express();
app.set('port', process.env.PORT || 5000);
app.use(express.static('public'))
app.use(bodyParser.json());

app.post('/api/v1/echo', function(req, res) {
  switch(req.body.request.type) {
    case 'LaunchRequest':
      echo.handleLaunch(req.body).then(response => {
        res.send(response)
      }).catch(err => {
        res.send(err)
      })
      break;
    case 'IntentRequest':
      echo.handleIntent(req.body).then(response => {
        res.send(response)
      }).catch(err => {
        res.send(err)
      })
      break;
    default: // SessionEndedRequest
      echo.handleSessionEnded(req.body).then(response => {
        res.send(response)
      }).catch(err => {
        res.send(err)
      })
      break;
  }
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
module.exports = app;
