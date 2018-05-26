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

function getDetailsData(data, id) {
  return data.filter(
    function (data) { return data.id == id }
  );
}

router.get('/', function (req, res) {
  res.render('index', {
    page: 'Home'
  });
});

router.get('/modalities/:id*?', function (req, res) {
  res.render('modalities', {
    page: 'Modalities',
    id: req.params.id,
    list: zodiacData.modalities,
    details: zodiacData.modalities.find(x => x.id === req.params.id)
  });
});

router.get('/elements/:id*?', function (req, res) {
  res.render('elements', {
    page: 'Elements',
    id: req.params.id,
    list: zodiacData.elements,
    details: zodiacData.elements.find(x => x.id === req.params.id)
  });
});

router.get('/polarities/:id*?', function (req, res) {
  res.render('polarities', {
    page: 'Polarities',
    id: req.params.id,
    list: zodiacData.polarities,
    details: zodiacData.polarities.find(x => x.id === req.params.id)
  });
});

router.get('/signs/:id*?', function (req, res) {
  if (req.params.name) {
    var sign = zodiacData.signs.find(x => x.id === req.params.id).name;
    var url = horoscopeURL('today', sign);
    request(url, function (err, response, body) {
      if (err || response.statusCode !== 200) {
        console.log(url);
        return res.sendStatus(500);
      }
      data = JSON.parse(body);
      res.render('signs', {
        page: 'Signs',
        id: req.params.id,
        list: zodiacData.signs,
        details: zodiacData.signs.find(x => x.id === req.params.id),
        horoscope: data.horoscope.replace("['", "").replace("']", ""),
        date: data.date
      });
    });
  } else {
    res.render('signs', {
      page: 'Signs',
      id: req.params.id,
      list: zodiacData.signs
    });
  }
});

module.exports = router;