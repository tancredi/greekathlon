// Generated by CoffeeScript 1.6.1
(function() {
  var BaseView, OutputView, device, generateDigitCtx, getByRole, views,
    _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('../core/View').BaseView;

  getByRole = require('../helpers/dom').getByRole;

  generateDigitCtx = require('../helpers/system').generateDigitCtx;

  device = require('../core/device');

  views = require('../core/views');

  OutputView = (function(_super) {

    __extends(OutputView, _super);

    OutputView.prototype.templateName = 'result';

    OutputView.prototype.fixHeight = true;

    OutputView.prototype.classNames = 'view-results';

    OutputView.prototype.getElements = function() {
      OutputView.__super__.getElements.call(this);
      return this.elements.back = getByRole('back', this.elements.main);
    };

    function OutputView(digits) {
      var pairContexts,
        _this = this;
      this.bind = function() {
        return OutputView.prototype.bind.apply(_this, arguments);
      };
      this.getElements = function() {
        return OutputView.prototype.getElements.apply(_this, arguments);
      };
      pairContexts = generateDigitCtx(digits);
      $.extend(this.context, pairContexts);
    }

    OutputView.prototype.bind = function() {
      OutputView.__super__.bind.call(this);
      return this.elements.back.on('click touchend', function() {
        return views.open('home', 'slide-left');
      });
    };

    return OutputView;

  })(BaseView);

  module.exports = {
    OutputView: OutputView
  };

}).call(this);