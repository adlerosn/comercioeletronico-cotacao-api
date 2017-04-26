var express = require('express');
var cors = require('cors');
var consign = require('consign');
var bodyParser = require('body-parser');

module.exports = function () {
  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(cors());

  consign()
    .include('controllers')//.then('persistencia')
    .into(app);

  return app;
}
