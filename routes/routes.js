var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var zodiacData = JSON.parse(fs.readFileSync('zodiac.json', 'utf8'));

function horoscopeURL(interval, sign) {
  return "http://sandipbgt.com/theastrologer/api/horoscope/" + sign + "/" + interval
};

router.get('/', function (req, res) {
  res.render('index', {});
});

router.get('/celestial-body/:id', function (req, res) {
  res.render('celestial-body', {
    id: req.params.id
  });
});

router.get('/modality/:id', function (req, res) {
  res.render('modality', {
    id: req.params.id
  });
});

router.get('/element/:id', function (req, res) {
  res.render('element', {
    id: req.params.id
  });
});

router.get('/polarity/:id', function (req, res) {
  res.render('polarity', {
    id: req.params.id
  });
});

router.get('/sign', function (req, res) {
  res.render('sign', {});
});

router.get('/sign/:id', function (req, res) {
  var id = req.params.id;
  var sign = zodiacData.signs[req.params.id];
  var url = horoscopeURL('today', id);
  request(url, function (err, response, body) {
    if (err || response.statusCode !== 200) {
      console.log(url);
      return res.sendStatus(500);
    }
    data = JSON.parse(body);
    res.render('sign', {
      interval: req.params.interval,
      id: req.params.id,
      sign: zodiacData.signs[req.params.id],
      horoscope: data.horoscope.replace('(c) Kelli Fox, The Astrologer, http://new.theastrologer.com', ''),
      date: data.date
    });
  });
});

module.exports = router;