var express = require('express');
var router = express.Router();
var got = require('got');
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('zodiac.json', 'utf8'));

function filterArrayByValue(array, key, value) {
  return array.filter(
    object => object[key] == value
  );
}

function horoscopeURL(sign, day = 'today') {
  return 'https://aztro.sameerkumar.website/?sign=' + sign + '&day=' + day
}

router.get('/', function (req, res) {
  res.render('index', {
    page: 'Home'
  });
});

router.get('/:page/:id?', function (req, res, next) {
  let pageInfo = filterArrayByValue(data.pages, 'id', req.params.page)[0];
  req.pageId = req.params.page;
  req.pageName = pageInfo.name;
  req.pageTemplate = req.params.page;
  req.options = {
    page: req.pageName,
    list: data[req.params.page]
  };
  next();
});

router.get('/modalities/:id?', function (req, res) {
  let options = req.options;
  if (req.params.id) {
    options.details = filterArrayByValue(options.list, 'id', req.params.id)[0];
    options.details.signs = filterArrayByValue(data.signs, 'modality', options.details.name);
    options.id = req.params.id;
  };
  res.render(req.pageTemplate, options);
});

router.get('/elements/:id?', function (req, res) {
  let options = req.options;
  if (req.params.id) {
    options.details = filterArrayByValue(options.list, 'id', req.params.id)[0];
    options.details.signs = filterArrayByValue(data.signs, 'element', options.details.name);
    options.id = req.params.id;
  };
  res.render(req.pageTemplate, options);
});

router.get('/polarities/:id?', function (req, res) {
  let options = req.options;
  if (req.params.id) {
    options.details = filterArrayByValue(options.list, 'id', req.params.id)[0];
    options.details.signs = filterArrayByValue(data.signs, 'polarity', options.details.name);
    options.id = req.params.id;
  };
  res.render(req.pageTemplate, options);
});

router.get('/celestial-bodies/:id?', function (req, res) {
  let options = req.options;
  if (req.params.id) {
    options.details = filterArrayByValue(options.list, 'id', req.params.id)[0];
    options.details.signs = filterArrayByValue(data.signs, 'celestialBody', options.details.name);
    options.id = req.params.id;
  };
  res.render(req.pageTemplate, options);
});

router.get('/signs/:id?', function (req, res) {
  let options = req.options;
  if (req.params.id) {
    options.id = req.params.id;
    options.details = filterArrayByValue(options.list, 'id', req.params.id)[0];
    got(horoscopeURL(req.params.id), {
      method: 'POST',
      json: true
    }).then(response => {
      options.details.horoscope = response.body["description"].replace('--', '—');
      options.details.horoscopeDate = response.body["current_date"];
      res.render(req.pageTemplate, options);
    }).catch(error => {
      res.render(req.pageTemplate, options);
    });
  } else {
    res.render(req.pageTemplate, options);
  };
});

module.exports = router;