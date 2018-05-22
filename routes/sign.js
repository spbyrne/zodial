var express = require('express');
var router = express.Router();

router.get('/sign/:name', function (req, res, next) {
  res.render('sign', {
    sign: req.params.name
  });
});

module.exports = router;