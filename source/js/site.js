var $ = require('jquery');
var smoothState = require('./_smoothState.js');

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
        if (target != location) {
          body.dataset.location = target;
        }
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
      onReady: {
        duration: 0,
        render: function ($container, $newContent) {
          $container.removeClass('is-exiting');
          $container.html($newContent);
        }
      }
    },
    smoothState = $('#main')
    .smoothState(options)
    .data('smoothState');
});