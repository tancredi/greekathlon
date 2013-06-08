// Generated by CoffeeScript 1.6.1
(function() {
  var generateDigitCtx, generateValCtx, map, vowels;

  map = require('../fixtures/map');

  vowels = ['a', 'e', 'i', 'o', 'u'];

  generateDigitCtx = function(digits) {
    var first, i, index, pair, pairContexts, pairs, second, str, _i, _j, _len, _ref;
    pairContexts = [];
    pairs = [];
    for (i = _i = 0, _ref = (digits.length - 1) / 2; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      first = digits[i * 2];
      second = digits[i * 2 + 1] || '';
      pairs.push("" + first + second);
    }
    for (_j = 0, _len = pairs.length; _j < _len; _j++) {
      pair = pairs[_j];
      index = parseInt(pair, 10);
      str = map[index];
      pairContexts.push(generateValCtx(pair, str));
    }
    return {
      pairs: pairContexts,
      digits: digits
    };
  };

  generateValCtx = function(pair, str) {
    var char, consParts, digit, digits, parts, temp, _i, _j, _len, _len1;
    parts = [];
    consParts = [];
    temp = {
      vow: false,
      val: ''
    };
    for (_i = 0, _len = str.length; _i < _len; _i++) {
      char = str[_i];
      if (vowels.indexOf(char) !== -1) {
        if (temp.val.length > 0) {
          parts.push(temp);
          consParts.push(temp);
        }
        temp = {
          vow: false,
          val: ''
        };
        parts.push({
          vow: true,
          val: char
        });
      } else {
        temp.val += char;
      }
    }
    if (temp.val.length > 0) {
      parts.push(temp);
      consParts.push(temp);
    }
    if (consParts.length > 0) {
      consParts[0].num = pair[0];
    }
    if (consParts.length > 1) {
      consParts[1].num = pair[1];
    }
    digits = [];
    for (_j = 0, _len1 = pair.length; _j < _len1; _j++) {
      digit = pair[_j];
      digits.push({
        num: digit
      });
    }
    return {
      parts: parts,
      digits: digits
    };
  };

  module.exports = {
    generateDigitCtx: generateDigitCtx,
    generateValCtx: generateValCtx
  };

}).call(this);
