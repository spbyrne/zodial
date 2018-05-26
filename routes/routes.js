var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var zodiacData = JSON.parse(fs.readFileSync('zodiac.json', 'utf8'));

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, '');
  str = str.toLowerCase();

  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return str;
}

function horoscopeURL(interval, sign) {
  return (
    'http://horoscope-api.herokuapp.com/horoscope/' + interval + '/' + sign
  );
}

function getIndexData(page) {
  var selector = slugify(page);
  return zodiacData.selector;
}

function getDetailsData(data, name) {
  return data.filter(
    function (data) { return data.name == name }
  );
}

router.get('/', function (req, res) {
  res.render('index', {
    page: 'home'
  });
});

router.get('/modalities/:name*?', function (req, res) {
  var sectionName = 'Modalities';
  var pageName = req.params.name;
  var indexData = getIndexData(slugify(sectionName));
  var detailsData = pageName ? getDetailsData(indexData, pageName) : "";
  res.render('modalities', {
    page: sectionName,
    name: pageName,
    list: indexData,
    details: detailsData
  });
});

router.get('/elements/:name*?', function (req, res) {
  res.render('elements', {
    page: 'Elements',
    name: req.params.name,
    pageData: getPageData(page, name)
  });
});

router.get('/polarities/:name*?', function (req, res) {
  res.render('polarities', {
    page: 'Polarities',
    name: req.params.name,
    pageData: getPageData(page, name)
  });
});

router.get('/sign', function (req, res) {
  res.render('sign', {
    page: 'sign'
  });
});

router.get('/sign/:name*?', function (req, res) {
  if (req.params.name) {
    var sign = zodiacData.signs[req.params.name].name;
    var url = horoscopeURL('today', sign);
    request(url, function (err, response, body) {
      if (err || response.statusCode !== 200) {
        console.log(url);
        return res.sendStatus(500);
      }
      data = JSON.parse(body);
      res.render('sign', {
        page: 'sign',
        interval: req.params.interval,
        name: req.params.name,
        sign: zodiacData.signs[req.params.name],
        horoscope: data.horoscope.replace("['", "").replace("']", ""),
        date: data.date
      });
    });
  } else {
    res.render('sign', {
      page: 'sign'
    });
  }
});

module.exports = router;