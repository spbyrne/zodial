var express = require('express');
var router = express.Router();
var got = require('got');
var fs = require('fs');
var path = require('path');
var data = JSON.parse(fs.readFileSync('zodiac.json', 'utf8'));
var mcache = require('memory-cache');

var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

function filterArrayByValue(array, key, value) {
  return array.filter(
    object => object[key] == value
  );
}

function horoscopeURL(sign, day = 'today') {
  return 'https://aztro.sameerkumar.website/?sign=' + sign + '&day=' + day
}

router.get('/', cache(30), function (req, res) {
  res.render('index');
});

router.get('/:page/:id?', cache(30), function (req, res, next) {
  if (['img', 'css', 'js'].indexOf(req.params.page) > -1) next();
  let pageInfo = filterArrayByValue(data.pages, 'id', req.params.page)[0];
  if (pageInfo) {
    req.pageId = req.params.page;
    req.pageName = pageInfo.name;
    req.pageTemplate = req.params.page;
    req.options = {
      page: pageInfo,
      list: data[req.params.page]
    };
  };
  if (req.params.id) {
    req.options.details = filterArrayByValue(req.options.list, 'id', req.params.id)[0];
    req.options.id = req.params.id;
  };
  next();
});

router.get('/modalities/:id?', function (req, res) {
  if (req.params.id) {
    req.options.details.signs = filterArrayByValue(data.signs, 'modality', req.options.details.name);
  };
  res.render(req.pageTemplate, req.options);
});

router.get('/elements/:id?', function (req, res) {
  if (req.params.id) {
    req.options.details.signs = filterArrayByValue(data.signs, 'element', req.options.details.name);
  };
  res.render(req.pageTemplate, req.options);
});

router.get('/polarities/:id?', function (req, res) {
  if (req.params.id) {
    req.options.details.signs = filterArrayByValue(data.signs, 'polarity', req.options.details.name);
  };
  res.render(req.pageTemplate, req.options);
});

router.get('/celestial-bodies/:id?', function (req, res) {
  if (req.params.id) {
    req.options.details.signs = filterArrayByValue(data.signs, 'celestialBody', req.options.details.name);
  };
  res.render(req.pageTemplate, req.options);
});

router.get('/signs/:id?', function (req, res) {
  if (req.params.id) {
    got(horoscopeURL(req.params.id), {
      method: 'POST',
      json: true
    }).then(response => {
      req.options.details.horoscope = response.body["description"].replace('--', '—');
      req.options.details.horoscopeDate = response.body["current_date"];
      res.render(req.pageTemplate, req.options);
    }).catch(error => {
      res.render(req.pageTemplate, req.options);
    });
  } else {
    res.render(req.pageTemplate, req.options);
  };
});

module.exports = router;