// Generated by CoffeeScript 1.6.1
(function() {
  var activeStateDuration, classNames, clickables, device;

  device = require('../core/device');

  clickables = 'a, .button, button, input, .touchable, .clickable';

  classNames = {
    touchActive: 'touch-active'
  };

  activeStateDuration = 200;

  module.exports = {
    initialise: function() {
      return this.bind();
    },
    bind: function() {
      var self;
      self = this;
      return $('body').on(device.get('clickEvent'), clickables, function() {
        return self.onClick($(this));
      });
    },
    onClick: function(element) {
      var _this = this;
      element.addClass(classNames.touchActive);
      return element.data('touchActiveTimer', setTimeout(function() {
        element.removeClass(classNames.touchActive);
        if (element.data('touchActiveTimer') != null) {
          return clearTimeout(element.data('touchActiveTimer'));
        }
      }, activeStateDuration));
    }
  };

}).call(this);