var express = require('express');
var app = express();
var expressNunjucks = require('express-nunjucks');
var compression = require('compression');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var isDev = app.get('env') === 'development';
var fs = require('fs');

var siteData = JSON.parse(fs.readFileSync('zodiac.json', 'utf8'));
var njk = expressNunjucks(app, {
  watch: isDev,
  noCache: isDev,
  globals: siteData
});

var indexRouter = require('./routes/index');
var signRouter = require('./routes/sign');

app.set('views', __dirname + '/views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sign/:name', signRouter);

module.exports = app;