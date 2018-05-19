var $ = require('jquery');
//=require ../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js

document.addEventListener('DOMContentLoaded', function () {
  headerPush();
});

var headerPush = function () {
  var siteHeader = document.querySelector('.site-header');
  var siteMain = document.querySelector('.site-main');
  if (siteHeader.classList.contains('site-header--absolute')) {
    var headerHeight = siteHeader.offsetHeight;
    var firstElement = siteMain.querySelector('*:first-child');
    var currentTopPadding = parseInt(
      window
        .getComputedStyle(firstElement, null)
        .getPropertyValue('padding-top')
    );
    var newTopPadding = headerHeight + currentTopPadding;
    firstElement.style.paddingTop = newTopPadding + 'px';
  }
};
