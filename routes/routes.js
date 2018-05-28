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

router.get('/modalities/:id?', function (req, res) {
  let pageName = 'Modalities';
  let pageTemplate = 'modalities';
  let requestId = req.params.id;
  let requestList = data.modalities;
  let options = {
    page: pageName,
    list: requestList
  };
  if (requestId) {
    let requestDetails = filterArrayByValue(requestList, 'id', requestId)[0];
    requestDetails.signs = filterArrayByValue(data.signs, 'modality', requestDetails.name);
    options.id = requestId;
    options.details = requestDetails;
  };
  res.render(pageTemplate, options);
});

router.get('/elements/:id?', function (req, res) {
  let pageName = 'Elements';
  let pageTemplate = 'elements';
  let requestId = req.params.id;
  let requestList = data.elements;
  let options = {
    page: pageName,
    list: requestList
  };
  if (requestId) {
    let requestDetails = filterArrayByValue(requestList, 'id', requestId)[0];
    requestDetails.signs = filterArrayByValue(data.signs, 'element', requestDetails.name);
    options.id = requestId;
    options.details = requestDetails;
  };
  res.render(pageTemplate, options);
});

router.get('/polarities/:id?', function (req, res) {
  let pageName = 'Polarities';
  let pageTemplate = 'polarities';
  let requestId = req.params.id;
  let requestList = data.polarities;
  let options = {
    page: pageName,
    list: requestList
  };
  if (requestId) {
    let requestDetails = filterArrayByValue(requestList, 'id', requestId)[0];
    requestDetails.signs = filterArrayByValue(data.signs, 'polarity', requestDetails.name);
    options.id = requestId;
    options.details = requestDetails;
  };
  res.render(pageTemplate, options);
});

router.get('/signs/:id?', function (req, res) {
  let pageName = 'Signs';
  let pageTemplate = 'signs';
  let requestId = req.params.id;
  let requestList = data.signs;
  let options = {
    page: pageName,
    list: requestList
  };
  if (requestId) {
    options.id = requestId;
    let requestDetails = filterArrayByValue(requestList, 'id', requestId)[0];
    got(horoscopeURL(requestId), {
      method: 'POST',
      json: true
    }).then(response => {
      console.log(response.body);
      requestDetails.horoscope = response.body["description"].replace('--', '—');
      requestDetails.horoscopeDate = response.body["current_date"];
      options.details = requestDetails;
      res.render(pageTemplate, options);
    }).catch(error => {
      console.log(error.response.body);
      options.details = requestDetails;
      res.render(pageTemplate, options);
    });
  } else {
    res.render(pageTemplate, options);
  };
});

module.exports = router;