const express = require('express');
const app = express();
const expressNunjucks = require('express-nunjucks');
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const router = require('./routes/routes');
const minifyHTML = require('express-minify-html');
const zodiacData = JSON.parse(fs.readFileSync('zodiac.json', 'utf8'));
const njk = expressNunjucks(app, {
  watch: false,
  noCache: false,
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