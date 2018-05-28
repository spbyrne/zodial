var $ = require('jquery');
var smoothState = require('./_smoothState.js');

document.addEventListener('DOMContentLoaded', function () { // HTML is loaded
  toggleFullScreen();
});

$(function () {
  'use strict';
  var transition = 'inward';
  var $main = $('#main');
  var options = {
      prefetch: true,
      cacheLength: 10,
      blacklist: '.no-transition',
      onBefore: function ($anchor, $container) {
        var body = document.querySelector('body');
        var target = $anchor.data('target');
        var location = body.dataset.location;
        $container.removeClass('new-location');
        if (target != location) {
          body.dataset.location = target;
          $container.addClass('new-location');
        }
        $('.main-nav__link.active:not([data-target="' + target + '"])').addClass('was-active');
        if ($anchor.hasClass("main-nav__link")) {
          $('.main-nav__link').removeClass('active');
        } else {
          $('.main-nav__link[data-target="' + target + '"]:not(.active)').addClass('loading');
        }
        $('.main-nav__link:not([data-target="' + target + '"])').removeClass('active');
        $('a:not(.main-nav__link)').removeClass('loading active');
        $anchor.addClass('loading');
      },
      onStart: {
        duration: 250,
        render: function ($container) {
          $container.addClass('is-exiting');
          smoothState.restartCSSAnimations();
        }
      },
      onProgress: {
        duration: 0,
        render: function ($container) {
          // Do something while loading
        }
      },
      onReady: {
        duration: 625,
        render: function ($container, $newContent) {
          $container.removeClass('is-exiting');
          $container.html($newContent);
        }
      },
      onAfter: function ($container, $newContent) {
        $container.removeClass('new-location');
      }
    },
    smoothState = $('#main')
    .smoothState(options)
    .data('smoothState');
});

function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
}