var $ = require('jquery');
var smoothState = require('./_smoothState.js');

$(function () {
  'use strict';
  var transition = 'inward';
  var $main = $('#main');
  var options = {
      prefetch: true,
      cacheLength: 4,
      onBefore: function ($anchor, $container) {
        var depth = $('[data-depth]')
          .first()
          .data('depth');
        var target = $anchor.data('target');
        depth = depth ? depth : 0;
        target = target ? target : 0;
        if (depth <= target) {
          transition = 'inward';
        } else {
          transition = 'outward';
        }
      },
      onStart: {
        duration: 250,
        render: function ($container) {
          $main.attr('data-transition', transition);
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