var express = require('express');
var app = express();
var expressNunjucks = require('express-nunjucks');
var compression = require('compression');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var isDev = app.get('env') === 'development';
var fs = require('fs');
var router = require('./routes/routes');
var minifyHTML = require('express-minify-html');

var zodiacData = JSON.parse(fs.readFileSync('zodiac.json', 'utf8'));
var njk = expressNunjucks(app, {
  watch: isDev,
  noCache: isDev,
  globals: zodiacData
});

app.set('views', __dirname + '/views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true
  }
}));
app.use(compression());
app.use(express.static('public'));
app.use('/', router);

module.exports = app;