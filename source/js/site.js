var $ = require('jquery');
var smoothState = require('./_smoothState.js');
var site = require('../../zodiac.json').site;

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
      var loadingIndicator = document.querySelector('.loading-indicator');
      var section = $anchor.data('section');
      var id = $anchor.data('id');
      var title = $anchor.attr('title');
      var location = body.dataset.location;
      $container.removeClass('new-location');
      loadingIndicator.dataset.loading = title;
      if (section != location) {
        body.dataset.location = section;
        $container.addClass('new-location');
        $('.page-nav').addClass('exit');
      }
      if (section != location) {
        body.dataset.location = section;
        $container.addClass('new-location');
        $('.page-nav').addClass('exit');
      }
      $('.main-nav__link.active:not([data-section="' + section + '"])').addClass('was-active');
      if ($anchor.hasClass("main-nav__link")) {
        $('.main-nav__link').removeClass('active');
      } else {
        $('.main-nav__link[data-section="' + section + '"]:not(.active)').addClass('loading');
      }
      $('.main-nav__link:not([data-section="' + section + '"])').removeClass('active');
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
      duration: 1000,
      render: function ($container, $newContent) {
        $container.removeClass('is-exiting');
        $container.html($newContent);
        $('.page-nav').removeClass('exit');
        googleAnalytics(window.location.pathname);
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

function googleAnalytics(url) {
  gtag('config', site.analytics, {
    'page_path': url
  });
};