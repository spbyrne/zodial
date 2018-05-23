var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var zodiacData = JSON.parse(fs.readFileSync('zodiac.json', 'utf8'));

function horoscopeURL(interval, sign) {
  return "http://sandipbgt.com/theastrologer/api/horoscope/" + sign + "/" + interval
};

router.get('/', function (req, res) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/sign/:slug', function (req, res) {
  var slug = req.params.slug;
  var sign = zodiacData.signs[req.params.slug];
  var url = horoscopeURL('today', slug);
  request(url, function (err, response, body) {
    if (err || response.statusCode !== 200) {
      console.log(url);
      return res.sendStatus(500);
    }
    data = JSON.parse(body);
    res.render('sign', {
      interval: req.params.interval,
      slug: req.params.slug,
      sign: zodiacData.signs[req.params.slug],
      horoscope: data.horoscope.replace('(c) Kelli Fox, The Astrologer, http://new.theastrologer.com', ''),
      date: data.date
    });
  });
});

router.get('/sign/:slug/:interval', function (req, res) {
  var interval = req.params.interval;
  var slug = req.params.slug;
  var sign = zodiacData.signs[req.params.slug];
  var url = horoscopeURL(interval, slug);
  request(url, function (err, response, body) {
    if (err || response.statusCode !== 200) {
      console.log(url);
      return res.sendStatus(500);
    }
    data = JSON.parse(body);
    res.render('horoscope', {
      interval: req.params.interval,
      slug: req.params.slug,
      sign: zodiacData.signs[req.params.slug],
      horoscope: data.horoscope,
      date: data.date
    });
  });
});

module.exports = router;