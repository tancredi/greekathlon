// Generated by CoffeeScript 1.6.1
(function() {
  var Game, Grid, ScoreCounter, botReactionDelay, classNames, debug, defaults, device, dictionaries, difficulties, fx, views,
    _this = this;

  dictionaries = require('../dictionaries/index');

  views = require('../core/views');

  device = require('../core/device');

  debug = require('../core/debug');

  Grid = require('./Grid').Grid;

  ScoreCounter = require('./ScoreCounter').ScoreCounter;

  fx = require('../ui/fx');

  difficulties = {
    easy: {
      botSuccessRate: 40
    },
    medium: {
      botSuccessRate: 65
    },
    hard: {
      botSuccessRate: 90
    }
  };

  botReactionDelay = debug.get('fast') ? 200 : 1500;

  classNames = {
    started: 'game-started'
  };

  defaults = {
    difficulty: 'medium',
    gridSize: [3, 3],
    targetsNum: 4
  };

  Game = (function() {

    function Game(options) {
      var _this = this;
      this.addPoint = function(player, callback) {
        return Game.prototype.addPoint.apply(_this, arguments);
      };
      this.opponentMisses = function() {
        return Game.prototype.opponentMisses.apply(_this, arguments);
      };
      this.opponentHits = function(tile) {
        return Game.prototype.opponentHits.apply(_this, arguments);
      };
      this.opponentTurn = function() {
        return Game.prototype.opponentTurn.apply(_this, arguments);
      };
      this.onTestAnswered = function(tileElement, correct) {
        return Game.prototype.onTestAnswered.apply(_this, arguments);
      };
      this.pickRandomTest = function(type) {
        if (type == null) {
          type = 'multiple-choice';
        }
        return Game.prototype.pickRandomTest.apply(_this, arguments);
      };
      this.attackTile = function(tile) {
        return Game.prototype.attackTile.apply(_this, arguments);
      };
      this.bind = function() {
        return Game.prototype.bind.apply(_this, arguments);
      };
      this.changeTurn = function() {
        return Game.prototype.changeTurn.apply(_this, arguments);
      };
      this.initScoreCounters = function() {
        return Game.prototype.initScoreCounters.apply(_this, arguments);
      };
      this.initGrids = function() {
        return Game.prototype.initGrids.apply(_this, arguments);
      };
      this.onViewReady = function() {
        return Game.prototype.onViewReady.apply(_this, arguments);
      };
      this.start = function() {
        return Game.prototype.start.apply(_this, arguments);
      };
      this.dictionary = dictionaries.spanish;
      this.options = $.extend(true, {}, defaults, options);
      this.difficulty = difficulties[this.options.difficulty];
    }

    Game.prototype.start = function() {
      var _this = this;
      return views.open('game.index', 'pop-out', function(view) {
        _this.view = view;
        return _this.onViewReady();
      });
    };

    Game.prototype.onViewReady = function() {
      var _this = this;
      this.initGrids();
      this.initScoreCounters();
      this.turn = Math.floor(Math.random() * 2) ? 'self' : 'opponent';
      return this.grids.self.onTilesShown = function() {
        _this.view.elements.game.addClass(classNames.started);
        _this.changeTurn();
        return _this.bind();
      };
    };

    Game.prototype.initGrids = function() {
      var opponentOptions, options;
      options = {
        size: this.options.gridSize,
        targetsNum: this.options.targetsNum
      };
      opponentOptions = $.extend(true, {}, options);
      opponentOptions.opponent = true;
      this.grids = {
        self: new Grid(options),
        opponent: new Grid(opponentOptions)
      };
      this.grids.self.render(this.view.elements.gridWraps.self, true);
      return this.grids.opponent.render(this.view.elements.gridWraps.opponent);
    };

    Game.prototype.initScoreCounters = function() {
      var options;
      options = {
        targetsNum: this.options.targetsNum
      };
      this.scoreCounters = {
        self: new ScoreCounter(options),
        opponent: new ScoreCounter(options)
      };
      this.scoreCounters.self.render(this.view.elements.gridWraps.opponent);
      return this.scoreCounters.opponent.render(this.view.elements.gridWraps.self);
    };

    Game.prototype.changeTurn = function() {
      this.view.elements.game.removeClass("turn-" + this.turn);
      if (this.turn === 'self') {
        this.turn = 'opponent';
      } else {
        this.turn = 'self';
      }
      this.view.elements.game.addClass("turn-" + this.turn);
      if (this.turn === 'opponent') {
        return this.opponentTurn();
      }
    };

    Game.prototype.bind = function() {
      var self;
      self = this;
      return this.grids.opponent.element.on(device.get('clickEvent'), '[data-role="game-tile"][data-masked]', function() {
        if (self.turn === 'self') {
          return self.attackTile($(this));
        }
      });
    };

    Game.prototype.attackTile = function(tile) {
      var self, test, x, y,
        _this = this;
      self = this;
      x = parseInt(tile.attr('data-x'), 10);
      y = parseInt(tile.attr('data-y'), 10);
      test = this.pickRandomTest('multiple-choice');
      return views.open('tests.multiple-choice', 'slide-right', function(view) {
        return _(view).on('finish', function(correct) {
          return self.onTestAnswered(tile, correct);
        });
      }, true, test);
    };

    Game.prototype.pickRandomTest = function(type) {
      var index, tests;
      if (type == null) {
        type = 'multiple-choice';
      }
      if (this.dictionary["tests-" + type] != null) {
        tests = this.dictionary["tests-" + type];
        index = Math.floor(Math.random() * tests.length);
        return tests[index];
      } else {
        throw 'Game: No tests found in dictionary';
      }
    };

    Game.prototype.onTestAnswered = function(tileElement, correct) {
      var tile,
        _this = this;
      tile = tileElement.data('tile');
      return views.open(this.view, 'slide-left', function() {
        if (correct) {
          return _this.grids.opponent.updateTile(tile.x, tile.y, {
            revealed: true
          }, function() {
            if (tile.value === 'target') {
              return _this.addPoint('self', _this.changeTurn);
            } else {
              return _this.changeTurn();
            }
          });
        } else {
          return fx.popOut('miss', _this.changeTurn);
        }
      });
    };

    Game.prototype.opponentTurn = function() {
      var _this = this;
      return setTimeout(function() {
        var tile;
        tile = _this.grids.self.getRandomTile({
          hit: false
        });
        if (Math.random() * 100 < _this.difficulty.botSuccessRate) {
          return _this.opponentHits(tile);
        } else {
          return _this.opponentMisses();
        }
      }, botReactionDelay);
    };

    Game.prototype.opponentHits = function(tile) {
      var _this = this;
      return this.grids.self.updateTile(tile.x, tile.y, {
        hit: true
      }, function() {
        if (tile.value === 'target') {
          return _this.addPoint('opponent', function() {
            return setTimeout(_this.changeTurn, botReactionDelay);
          });
        } else {
          return setTimeout(_this.changeTurn, botReactionDelay);
        }
      });
    };

    Game.prototype.opponentMisses = function() {
      var _this = this;
      return fx.popOut('miss', function() {
        return setTimeout(function() {
          return _this.changeTurn();
        }, botReactionDelay);
      });
    };

    Game.prototype.addPoint = function(player, callback) {
      var counter;
      counter = this.scoreCounters[player];
      return counter.increment(callback);
    };

    return Game;

  })();

  module.exports = {
    Game: Game
  };

}).call(this);
