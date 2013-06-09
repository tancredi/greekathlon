;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {
  var bind, clickables, db, device, init, models, onDeviceReady, renderer, views;

  device = require('./core/device');

  clickables = require('./ui/clickables');

  db = require('./core/db');

  renderer = require('./core/renderer');

  views = require('./core/views');

  models = require('./core/models');

  views.load({
    home: require('./views/HomeView').HomeView,
    output: require('./views/OutputView').OutputView
  });

  models.load({
    digits: require('./models/Digits').Digits
  });

  renderer.templates = window.templates;

  init = function() {
    if (device.get('type') != null) {
      return bind();
    } else {
      return onDeviceReady();
    }
  };

  bind = function() {
    return document.addEventListener('deviceready', onDeviceReady, false);
  };

  onDeviceReady = function() {
    var _this = this;
    clickables.initialise();
    db.initialise();
    models.initialise();
    return models.onReady(function() {
      var view;
      return view = views.open('home');
    });
  };

  init();

}).call(this);

},{"./core/device":2,"./ui/clickables":3,"./core/db":4,"./core/renderer":5,"./core/views":6,"./core/models":7,"./views/HomeView":8,"./views/OutputView":9,"./models/Digits":10}],2:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {
  var device, onResize;

  device = {
    type: window.navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/),
    size: null,
    clickEvent: null
  };

  device.clickEvent = device.type != null ? 'touchend' : 'click';

  onResize = function() {
    return device.size = {
      width: $(window).innerWidth(),
      height: $(window).innerHeight()
    };
  };

  $(window).on('resize', onResize);

  onResize();

  module.exports = {
    get: function(prop) {
      switch (prop) {
        case 'type':
          return device.type;
        case 'size':
          return device.size;
        case 'clickEvent':
          return device.clickEvent;
        case 'center':
          return {
            x: device.size.width / 2,
            y: device.size.height / 2
          };
      }
    }
  };

}).call(this);

},{}],5:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {

  module.exports = {
    templates: {},
    compile: function(tpl) {
      var template;
      if (typeof template === 'function') {
        return template = tpl;
      } else {
        return Handlebars.compile(tpl);
      }
    },
    set: function(id, template) {
      return this.templates[id] = typeof template === 'string' ? this.compile(template) : template;
    },
    get: function(nsString) {
      if (nsString == null) {
        nsString = null;
      }
      if (nsString != null) {
        return this.templates[nsString];
      } else {
        return this.templates;
      }
    },
    render: function(id, data) {
      if (this.get(id) != null) {
        return this.get(id)(data);
      } else {
        throw "Template '" + id + "' not found";
      }
    }
  };

}).call(this);

},{}],3:[function(require,module,exports){
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
      return $('body').on('click touchend', clickables, function() {
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

},{"../core/device":2}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {
  var config, debugDb;

  debugDb = require('./debug').get('db');

  config = {
    ns: 'greekathlon',
    version: '',
    name: 'Greekathlon',
    estimatedSize: 1024 * 1024
  };

  module.exports = {
    initialise: function() {
      if (!window.openDatabase) {
        this.db = {
          transaction: function(callback) {
            return callback({
              executeSql: function(query, options, callback) {
                return callback(null, null);
              }
            });
          }
        };
        return this.supported = false;
      } else {
        this.db = window.openDatabase(config.ns, config.version, config.name, config.estimatedSize);
        return this.supported = true;
      }
    },
    onError: function(q, m) {
      return console.log('DB ERROR:', m);
    },
    query: function(queryStr, options, callback) {
      var _this = this;
      if (options == null) {
        options = [];
      }
      if (debugDb) {
        console.log("DB QUERY: " + queryStr);
      }
      return this.db.transaction(function(t) {
        return t.executeSql(queryStr, options, function(t, results) {
          results = results ? _this.fixResults(results) : [];
          if (typeof callback === 'function') {
            return callback(results);
          }
        }, _this.onError);
      }, this.onError);
    },
    fixResults: function(res) {
      var i, item, result, row, _i, _len, _ref;
      result = [];
      _ref = res.rows;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        item = _ref[i];
        row = res.rows.item(i);
        result.push(row);
      }
      return result;
    },
    select: function(table, conditions, options, callback) {
      var conditionStr, dir, key, queryStr, value;
      if (conditions == null) {
        conditions = {};
      }
      if (options == null) {
        options = {};
      }
      queryStr = "SELECT * FROM " + table;
      conditionStr = ((function() {
        var _results;
        _results = [];
        for (key in conditions) {
          value = conditions[key];
          _results.push("" + key + " = '" + value + "'");
        }
        return _results;
      })()).join(', ');
      if (conditionStr.length) {
        queryStr += " WHERE " + conditionStr;
      }
      if (options.order != null) {
        dir = options.order[1] > 0 ? 'ASC' : 'DESC';
        queryStr += " ORDER BY " + options.order[0] + " " + dir;
      }
      if (options.limit != null) {
        queryStr += " LIMIT " + options.limit;
      }
      return this.query(queryStr, [], callback);
    },
    insert: function(table, values, callback) {
      var key, keys, val;
      if (values == null) {
        values = {};
      }
      keys = ((function() {
        var _results;
        _results = [];
        for (key in values) {
          val = values[key];
          _results.push(key);
        }
        return _results;
      })()).join(', ');
      values = ((function() {
        var _results;
        _results = [];
        for (key in values) {
          val = values[key];
          _results.push("'" + val + "'");
        }
        return _results;
      })()).join(', ');
      return this.query("INSERT INTO " + table + "(" + keys + ") values(" + values + ")", [], callback);
    },
    createTable: function(tableName, schema, callback) {
      var fieldsStr, fieldsStrAdd, key, type;
      if (schema == null) {
        schema = {};
      }
      fieldsStr = "id INTEGER PRIMARY KEY AUTOINCREMENT";
      fieldsStrAdd = ((function() {
        var _results;
        _results = [];
        for (key in schema) {
          type = schema[key];
          _results.push("" + key + " " + type);
        }
        return _results;
      })()).join(', ');
      if (fieldsStrAdd.length) {
        fieldsStr = "" + fieldsStr + ", " + fieldsStrAdd;
      }
      return this.query("CREATE TABLE IF NOT EXISTS " + tableName + "(" + fieldsStr + ")", [], callback);
    },
    dropTable: function(tableName, callback) {
      return this.query("DROP TABLE " + tableName, [], callback);
    }
  };

}).call(this);

},{"./debug":11}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {
  var getByRole, renderer, transitions;

  renderer = require('./renderer');

  getByRole = require('../helpers/dom').getByRole;

  transitions = require('./viewTransitions');

  module.exports = {
    wrap: $('#view-wrap'),
    current: null,
    shown: [],
    views: {},
    closeAll: function() {
      return getByRole('view', this.wrap).remove();
    },
    load: function(ns, view) {
      var routes, _results;
      if (typeof ns === 'object') {
        routes = ns;
        _results = [];
        for (ns in routes) {
          view = routes[ns];
          _results.push(this.load(ns, view));
        }
        return _results;
      } else {
        return this.views[ns] = view;
      }
    },
    open: function(ns, transition, callback, openOnTop, options) {
      var view;
      if (transition == null) {
        transition = null;
      }
      if (callback == null) {
        callback = null;
      }
      if (openOnTop == null) {
        openOnTop = false;
      }
      if (options == null) {
        options = {};
      }
      if (!openOnTop) {
        this.shown = [];
      }
      if ((transition != null) && this.animating) {
        return false;
      }
      if (typeof ns === 'object') {
        view = ns;
      } else {
        view = new this.views[ns](options);
      }
      if (view.elements == null) {
        view.render(this.wrap);
      } else {
        view.show();
      }
      if ((transition != null) && _.has(this.transitions, transition)) {
        this.applyTransition(view, transition, callback, openOnTop);
      } else {
        this.onShown(view, callback, openOnTop);
      }
      return view;
    },
    applyTransition: function(view, transition, callback, openOnTop) {
      var newViewStyle, oldViewStyle,
        _this = this;
      if (callback == null) {
        callback = null;
      }
      if (openOnTop == null) {
        openOnTop = false;
      }
      this.animating = true;
      oldViewStyle = this.current.elements.main.attr('style');
      newViewStyle = view.elements.main.attr('style');
      return this.transitions[transition](view, this.current, function() {
        _this.animating = false;
        _this.onShown(view, callback, openOnTop);
        _this.current.elements.main.stop();
        view.elements.main.stop();
        if (oldViewStyle) {
          _this.current.elements.main.attr('style', oldViewStyle);
        } else {
          _this.current.elements.main.removeAttr('style');
        }
        if (newViewStyle) {
          view.elements.main.attr('style', newViewStyle);
        } else {
          view.elements.main.removeAttr('style');
        }
        return _this.wrap.removeAttr('style');
      });
    },
    onShown: function(view, callback, openOnTop) {
      if (callback == null) {
        callback = null;
      }
      if (openOnTop == null) {
        openOnTop = false;
      }
      if (!openOnTop) {
        if (this.current != null) {
          this.current.close();
        }
      } else {
        this.current.hide();
      }
      this.shown.push(view);
      this.current = view;
      if (callback != null) {
        return callback(view);
      }
    },
    transitions: transitions
  };

}).call(this);

},{"./renderer":5,"../helpers/dom":12,"./viewTransitions":13}],7:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {
  var db, debugDb, installedModels, modelsReadyCallbacks;

  db = require('./db');

  debugDb = require('./debug').get('db');

  if (_.has(localStorage, 'installedModels')) {
    installedModels = JSON.parse(localStorage.installedModels || {});
  } else {
    installedModels = {};
  }

  modelsReadyCallbacks = [];

  module.exports = {
    models: {},
    loaded: 0,
    ready: false,
    load: function(ns, model) {
      var routes, _results;
      if (typeof ns === 'object') {
        routes = ns;
        _results = [];
        for (ns in routes) {
          model = routes[ns];
          _results.push(this.load(ns, model));
        }
        return _results;
      } else {
        return this.models[ns] = model;
      }
    },
    initialise: function() {
      var id, model, _ref, _results;
      if (this.getModelsCount() === 0) {
        return this.onModelsReady();
      } else {
        _ref = this.models;
        _results = [];
        for (id in _ref) {
          model = _ref[id];
          _results.push(this.initModel(model));
        }
        return _results;
      }
    },
    initModel: function(model) {
      var isInstalled, isUpdated, serialisedSchema, tableName,
        _this = this;
      this.log("Init '" + model.prototype.tableName + "' schema...");
      tableName = model.prototype.tableName;
      isInstalled = _.has(installedModels, tableName);
      if (isInstalled) {
        serialisedSchema = JSON.stringify(model.prototype.schema);
        isUpdated = serialisedSchema === installedModels[tableName];
        if (!isUpdated) {
          return this.migrateModel(model, function() {
            return _this.onModelReady(model);
          });
        } else {
          return this.onModelReady(model);
        }
      } else {
        return this.installModel(model, function() {
          return _this.onModelReady(model);
        });
      }
    },
    installModel: function(model, callback) {
      var _this = this;
      this.log("Install '" + model.prototype.tableName + "' schema...");
      return db.createTable(model.prototype.tableName, model.prototype.schema, function() {
        installedModels[model.prototype.tableName] = JSON.stringify(model.prototype.schema);
        return _this.onModelReady(model);
      });
    },
    migrateModel: function(model, callback) {
      var _this = this;
      return db.dropTable(model.prototype.tableName, function() {
        return _this.installModel(model, callback);
      });
    },
    onModelReady: function(model) {
      this.log("'" + model.prototype.tableName + "' ready!");
      this.ready++;
      if (this.ready === this.getModelsCount()) {
        this.ready = true;
        return this.onModelsReady();
      }
    },
    onModelsReady: function() {
      var callback, _i, _len, _results;
      this.log('All models loaded!');
      localStorage.installedModels = JSON.stringify(installedModels);
      _results = [];
      for (_i = 0, _len = modelsReadyCallbacks.length; _i < _len; _i++) {
        callback = modelsReadyCallbacks[_i];
        _results.push(callback());
      }
      return _results;
    },
    onReady: function(callback) {
      if (this.ready) {
        callback();
      }
      return modelsReadyCallbacks.push(callback);
    },
    getModelsCount: function() {
      var count, model;
      count = 0;
      for (model in this.models) {
        count++;
      }
      return count;
    },
    log: function(m) {
      if (debugDb) {
        return console.log("DB: " + m);
      }
    }
  };

}).call(this);

},{"./db":4,"./debug":11}],8:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {
  var BaseView, HomeView, db, device, generateDigitCtx, getByRole, renderer, views,
    _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('../core/View').BaseView;

  getByRole = require('../helpers/dom').getByRole;

  device = require('../core/device');

  renderer = require('../core/renderer');

  views = require('../core/views');

  db = require('../core/db');

  generateDigitCtx = require('../helpers/system').generateDigitCtx;

  HomeView = (function(_super) {

    __extends(HomeView, _super);

    HomeView.prototype.templateName = 'home';

    function HomeView() {
      var _this = this;
      this.submit = function() {
        return HomeView.prototype.submit.apply(_this, arguments);
      };
      this.bind = function() {
        return HomeView.prototype.bind.apply(_this, arguments);
      };
      this.getElements = function() {
        return HomeView.prototype.getElements.apply(_this, arguments);
      };
    }

    HomeView.prototype.getElements = function() {
      HomeView.__super__.getElements.call(this);
      this.elements.form = this.elements.main.find('form');
      this.elements.input = getByRole('digit-input', this.elements.form);
      this.elements.button = this.elements.form.find('button');
      return this.elements.savedWrap = getByRole('saved-wrap', this.elements.main);
    };

    HomeView.prototype.bind = function() {
      var scrolling, self;
      HomeView.__super__.bind.call(this);
      self = this;
      this.elements.input.on('keydown', function(e) {
        var charCode, isAllowed, isNumber;
        charCode = e.which ? e.which : e.keyCode;
        isNumber = (charCode >= 48 && charCode <= 57) || charCode === 43;
        isAllowed = charCode === 8 || charCode === 13;
        if (!isNumber && !isAllowed) {
          return false;
        }
      });
      this.elements.input.on('change', function() {
        return self.submit();
      });
      this.elements.form.on('submit', function() {
        return false;
      });
      this.elements.button.on('click touchend', function() {
        self.submit();
        return false;
      });
      db.select('digits', {}, {
        order: ['id', -1]
      }, function(digits) {
        var ctx, entry, savedList, _i, _len;
        ctx = [];
        for (_i = 0, _len = digits.length; _i < _len; _i++) {
          entry = digits[_i];
          ctx.push(generateDigitCtx(entry.value));
        }
        savedList = $(renderer.render('saved-list', {
          entries: ctx
        }));
        return self.elements.savedWrap.append(savedList);
      });
      scrolling = null;
      this.elements.main.on('mousemove touchmove', '[data-role="saved-digits"]', function(e) {
        return scrolling = true;
      });
      this.elements.main.on('mousedown touchstart', '[data-role="saved-digits"]', function(e) {
        scrolling = false;
        return null;
      });
      return this.elements.main.on('mouseup touchend', '[data-role="saved-digits"]', function(e) {
        var digits;
        if (!scrolling) {
          digits = $(this).attr('data-digits');
          views.open('output', 'slide-right', null, false, digits);
        }
        scrolling = false;
        return true;
      });
    };

    HomeView.prototype.submit = function() {
      var digits;
      digits = this.elements.input.val();
      views.open('output', 'slide-right', null, false, digits);
      return db.insert('digits', {
        value: digits
      });
    };

    return HomeView;

  })(BaseView);

  module.exports = {
    HomeView: HomeView
  };

}).call(this);

},{"../core/View":14,"../helpers/dom":12,"../core/device":2,"../core/renderer":5,"../core/views":6,"../core/db":4,"../helpers/system":15}],9:[function(require,module,exports){
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

},{"../core/View":14,"../helpers/dom":12,"../helpers/system":15,"../core/device":2,"../core/views":6}],10:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {
  var BaseModel, Digits,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseModel = require('../core/Model').BaseModel;

  Digits = (function(_super) {

    __extends(Digits, _super);

    function Digits() {
      return Digits.__super__.constructor.apply(this, arguments);
    }

    Digits.prototype.tableName = 'digits';

    Digits.prototype.schema = {
      value: 'TEXT'
    };

    return Digits;

  })(BaseModel);

  module.exports = {
    Digits: Digits
  };

}).call(this);

},{"../core/Model":16}],11:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {
  var debug;

  debug = {
    fast: false,
    db: false
  };

  module.exports = {
    get: function(prop) {
      switch (prop) {
        case 'fast':
          return debug.fast;
        case 'db':
          return debug.db;
      }
    }
  };

}).call(this);

},{}],12:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {

  module.exports = {
    getByRole: function(role, parent, filter) {
      var selector;
      if (parent == null) {
        parent = null;
      }
      if (filter == null) {
        filter = '';
      }
      selector = "[data-role='" + role + "']" + filter;
      if (parent == null) {
        return $(selector);
      } else {
        return parent.find(selector);
      }
    }
  };

}).call(this);

},{}],16:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {
  var BaseModel;

  BaseModel = (function() {

    BaseModel.prototype.tableName = '';

    BaseModel.prototype.schema = {};

    function BaseModel(values) {}

    return BaseModel;

  })();

  module.exports = {
    BaseModel: BaseModel
  };

}).call(this);

},{}],13:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {
  var debug, defaultDuration, device, horizontalSlide, placeAbsolutely, popView, wrap;

  device = require('./device');

  debug = require('./debug');

  defaultDuration = debug.get('fast') ? 0 : 400;

  wrap = $('#view-wrap');

  placeAbsolutely = function(view) {
    var deviceSize;
    deviceSize = device.get('size');
    return view.elements.main.css({
      position: 'absolute',
      top: 0,
      left: 0,
      width: deviceSize.width,
      height: deviceSize.height
    });
  };

  popView = function(scaleFrom, newView, oldView, callback, duration) {
    if (duration == null) {
      duration = defaultDuration;
    }
    placeAbsolutely(newView);
    newView.elements.main.css({
      scale: scaleFrom,
      opacity: 0
    });
    newView.elements.main.transition({
      scale: 1,
      opacity: 1
    });
    return setTimeout(function() {
      return callback(newView);
    }, defaultDuration);
  };

  horizontalSlide = function(dir, newView, oldView, callback, duration) {
    var deviceSize;
    if (duration == null) {
      duration = defaultDuration;
    }
    deviceSize = device.get('size');
    wrap.css({
      width: deviceSize.width,
      'overflow-x': 'hidden',
      position: 'relative'
    });
    placeAbsolutely(newView);
    newView.elements.main.css({
      x: (100 * dir) + '%'
    });
    newView.elements.main.transition({
      x: '0'
    }, duration);
    if (oldView != null) {
      oldView.elements.main.css({
        width: deviceSize.width,
        height: deviceSize.height
      });
      return oldView.elements.main.transition({
        x: (100 * -dir) + '%'
      }, duration, function() {
        return callback(newView);
      });
    }
  };

  module.exports = {
    'slide-right': function(newView, oldView, callback) {
      return horizontalSlide(1, newView, oldView, callback);
    },
    'slide-left': function(newView, oldView, callback) {
      return horizontalSlide(-1, newView, oldView, callback);
    },
    'flip': function(newView, oldView, callback) {
      var duration;
      duration = defaultDuration;
      placeAbsolutely(newView);
      oldView.elements.main.css({
        position: 'relative',
        'z-index': 1
      });
      newView.elements.main.css({
        'z-index': -1,
        rotateY: '-90deg',
        z: -500
      });
      oldView.elements.main.transition({
        rotateY: '90deg'
      }, duration / 2);
      return setTimeout(function() {
        return newView.elements.main.transition({
          rotateY: '0deg'
        }, duration / 2);
      }, duration / 2, function() {
        return callback(newView);
      });
    },
    'pop-out': function(newView, oldView, callback) {
      return popView(2.2, newView, oldView, callback);
    },
    'pop-in': function(newView, oldView, callback) {
      return popView(.7, newView, oldView, callback);
    }
  };

}).call(this);

},{"./device":2,"./debug":11}],14:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {
  var BaseView, device, renderer,
    _this = this;

  renderer = require('./renderer');

  device = require('./device');

  BaseView = (function() {

    BaseView.prototype.templateName = '';

    BaseView.prototype.fixHeight = false;

    BaseView.prototype.classNames = '';

    BaseView.prototype.context = {};

    function BaseView() {
      var _this = this;
      this.show = function() {
        return BaseView.prototype.show.apply(_this, arguments);
      };
      this.hide = function() {
        return BaseView.prototype.hide.apply(_this, arguments);
      };
      this.close = function() {
        return BaseView.prototype.close.apply(_this, arguments);
      };
      this.bind = function() {
        return BaseView.prototype.bind.apply(_this, arguments);
      };
      this.resize = function() {
        return BaseView.prototype.resize.apply(_this, arguments);
      };
      this.getElements = function() {
        return BaseView.prototype.getElements.apply(_this, arguments);
      };
      this.render = function(wrapper) {
        return BaseView.prototype.render.apply(_this, arguments);
      };
    }

    BaseView.prototype.render = function(wrapper) {
      var rendered,
        _this = this;
      rendered = renderer.render("views/" + this.templateName, this.context);
      this.elements = {
        main: $("<div data-role='view' class='view " + this.classNames + "'>" + rendered + "</div>")
      };
      if (this.fixHeight) {
        this.elements.main.css({
          height: device.get('size').height
        });
      }
      this.getElements();
      if (wrapper != null) {
        this.elements.main.appendTo(wrapper);
      }
      this.resize();
      this.bind();
      $(window).on('resize', function() {
        return _this.resize();
      });
      return this;
    };

    BaseView.prototype.getElements = function() {};

    BaseView.prototype.resize = function() {};

    BaseView.prototype.bind = function() {};

    BaseView.prototype.close = function() {
      return this.elements.main.remove();
    };

    BaseView.prototype.hide = function() {
      return this.elements.main.hide();
    };

    BaseView.prototype.show = function() {
      this.elements.main.removeAttr('style');
      this.resize();
      return this.elements.main.show();
    };

    return BaseView;

  })();

  module.exports = {
    BaseView: BaseView
  };

}).call(this);

},{"./renderer":5,"./device":2}],15:[function(require,module,exports){
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
      digits: digits,
      icon: str.toLowerCase()
    };
  };

  module.exports = {
    generateDigitCtx: generateDigitCtx,
    generateValCtx: generateValCtx
  };

}).call(this);

},{"../fixtures/map":17}],17:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
(function() {

  module.exports = ['Sea', 'Tea', 'In', 'Me', 'Ray', 'Lay', 'Age', 'KO', 'Fee', 'Bee', 'Daze', 'Dot', 'Tune', 'Time', 'Tear', 'Tale', 'Tag', 'Tank', 'Fave', 'Top', 'Noise', 'Nuts', 'Nan', 'Ham', 'Here', 'Nail', 'Hog', 'Hack', 'Hive', 'Hub', 'Miss', 'Mad', 'Moon', 'Mum', 'War', 'Mail', 'Mug', 'Mac', 'Mafia', 'Web', 'Rose', 'Rat', 'Rain', 'RAM', 'Rex', 'Reel', 'Rag', 'Rock', 'Rev', 'Ruby', 'Lose', 'Load', 'Alien', 'Lamb', 'Liar', 'LOL', 'Lag', 'Look', 'Leaf', 'Lip', 'Gas', 'Jedi', 'Gain', 'Game', 'Jar', 'Jelly', 'Gig', 'Juice', 'Grave', 'Job', 'Kiss', 'Cat', 'Cane', 'Cam', 'Car', 'Cool', 'Cog', 'Code', 'Coffee', 'Cape', 'Vase', 'Fat', 'Van', 'Fame', 'Fire', 'Fuel', 'Fish', 'Fuck', 'FIFA', 'VIP', 'Bus', 'Boat', 'Bin', 'Boom', 'Bar', 'Ball', 'Bag', 'Book', 'Above', 'Baby'];

}).call(this);

},{}]},{},[1])
;