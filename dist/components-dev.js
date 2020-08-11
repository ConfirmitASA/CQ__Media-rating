// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"components-dev.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MediaRatingQuestion = /*#__PURE__*/function () {
  function MediaRatingQuestion(currentQuestion, mediaOptions) {
    _classCallCheck(this, MediaRatingQuestion);

    this.question = currentQuestion;
    this.options = mediaOptions;
    this.checks = 0;
    this.sliderMoved = false; // not in use yet; for future adaptation of the question depending on the screen orientation
    //this.screenOrientation = this.getOrientation();

    this.videoDuration = 0;
    this.init();
  }

  _createClass(MediaRatingQuestion, [{
    key: "init",
    value: function init() {
      this.renderVideoRatingQuestion();
    }
  }, {
    key: "renderVideoRatingQuestion",
    value: function renderVideoRatingQuestion() {
      var object = this; // add markup

      var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      if (this.options.sliderPosition == 'left') {
        $('#' + this.question.id + ' .cf-question__content').addClass('slider-left');
      }

      var notificationIos = '';

      if (iOS) {
        notificationIos = '<div id="apple-warning"><span style="text-transform:capitalize;">' + this.options.mediaType + '</span> is loading and will start shortly.</div>';
      }

      $('#' + this.question.id + ' .cf-question__content').prepend('' + notificationIos + '<div class="video-slider-container">' + '<div class="button-container"></div>' + '<div id="counter"></div>' + '<div class="video-container"  style="max-width: ' + this.options.width + 'px;"></div>' + '<div class="slider-container" style="max-width: ' + this.options.width + 'px;">' + '<div id="slider" class="uiColorSchemeFaded">' + '<div id="custom-handle" class="ui-slider-handle uiColorScheme"></div>' + '</div></div></div>' + ''); //hide countdown

      $('#counter').hide();
      var selectedBackground = $(".cf-navigation-next").css("background-color");
      var selectedForeground = $(".cf-navigation-next").css("color");
      var selectedLight = selectedBackground;

      if (selectedLight.indexOf("#") > -1) {
        selectedLight = this.adjustHexOpacity(selectedLight, 0.5);
      } else {
        selectedLight = selectedLight.replace('rgb', 'rgba').replace(')', ',0.5)');
      }

      $("head").append('<style>.uiColorScheme{ background-color: ' + selectedBackground + '!important; color: ' + selectedForeground + '!important; } .uiColorSchemeFaded{ background-color: ' + selectedLight + ';} </style>'); //add video

      var videoHTML = '<video id="' + this.question.id + '-rate-video" class="video-frame" style="width: 100%; height:auto;"><source src="' + this.options.src + '" type = "video/mp4" /><p class="vjs-no-js">To play this ' + this.options.mediaType + ' please enable JavaScript, and consider upgrading to a web browser that<a href="https://videojs.com/html5-video-support/" target = "_blank"> supports HTML5 video </a></p></video>';
      $(".video-container").append(videoHTML); //video settings

      var controlsVal = false;

      if (iOS) {
        controlsVal = false;
      } //console.log(this.question.id);


      var myPlayer = videojs(this.question.id + '-rate-video', {
        controls: controlsVal,
        autoplay: false,
        playsinline: true,
        preload: 'auto',
        responsive: true,
        poster: this.options.poster,
        fill: true
      });
      myPlayer.one("loadedmetadata", function () {
        changeCounterDisplay(object);
      }); //Changing duration to use a Math.round function

      function changeCounterDisplay(obj) {
        var counterMinutes = obj.setCounterMinutesDisplay(Math.floor(myPlayer.duration()));
        $('.video-container').prepend('<div class="videoTiming clearfix"><span class="videoTimingTitle"><span id="timeRemain">00:00</span>&nbsp;/&nbsp;<span id="videoLength">' + counterMinutes + ' </span></span><div id="spark"></div><div id="play-wrapper"><button type="button" class="uiColorScheme" id="startVideo">' + obj.options.playButtonText + '</button></div></div>');
        obj.videoDuration = Math.floor(myPlayer.duration());
        obj.generateSparklines(Math.floor(myPlayer.duration()));
      }

      ; //add slider

      var mySlider;
      var sliderHeight = '20px';
      $('.slider-container').css('height', sliderHeight);
      var orientation = 'horizontal';

      if (this.options.sliderPosition == 'left') {
        orientation = 'vertical';
      }

      var handle = $('#custom-handle');
      mySlider = $('#slider').slider({
        min: this.options.scaleMin,
        max: this.options.scaleMax,
        value: this.options.scaleStart,
        orientation: orientation,
        disabled: true,
        create: function create() {
          handle.text($(this).slider('value'));
        },
        slide: function slide(event, ui) {
          handle.text(ui.value);
          this.sliderMoved = true;
        }
      });
      var nextBtn = $('.cf-navigation-next');
      nextBtn.attr('disabled', true); //countdown

      $(document).on('click', '#startVideo', function () {
        startVideo(object);
      });

      function startVideo(obj) {
        myPlayer.play();
        myPlayer.pause();
        obj.playerCycle(myPlayer, mySlider);
        $('#startVideo').attr({
          'disabled': true
        });
      }
    }
  }, {
    key: "adjustHexOpacity",
    value: function adjustHexOpacity(color, opacity) {
      var r = parseInt(color.slice(1, 3), 16);
      var g = parseInt(color.slice(3, 5), 16);
      var b = parseInt(color.slice(5, 7), 16);
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
    }
  }, {
    key: "setCounterMinutesDisplay",
    value: function setCounterMinutesDisplay(seconds) {
      var minutes = 0;
      var remainingSeconds = 0;

      if (seconds >= 60) {
        minutes = seconds / 60;
      }

      minutes = Math.floor(minutes);
      remainingSeconds = seconds % 60;

      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
      }

      return minutes + ":" + remainingSeconds;
    }
  }, {
    key: "generateSparklines",
    value: function generateSparklines(seconds) {
      if (this.options.showSparkline == true) {
        var lines = "";
        var width = $("#spark").width() / seconds;
        var pcWidth = width / $("#spark").width() * 100;

        for (var i = 0; i < seconds; i++) {
          lines += '<span style="width:' + pcWidth + '%;" class="spark-line" id="spark-' + i + '"></span>';
        }

        $("#spark").html(lines);
      }
    }
  }, {
    key: "playerCycle",
    value: function playerCycle(player, sliderObj) {
      //$('#counter').show();
      var object = this;
      var timeleft = this.options.countdown;
      var startTimer = setInterval(function () {
        if (timeleft <= 0) {
          clearInterval(startTimer); //$('#counter').hide();

          $('#startVideo').text("Play");
          player.play();
          sliderObj.slider({
            disabled: false
          }); //var videoLength = Math.floor(player.duration()) + 1;

          var videoLength = Math.round(player.duration());
          object.collectData(player, videoLength, sliderObj);

          if (object.checks <= object.options.warningsAmount) {
            object.checkActivity(player, sliderObj);
          }
        } //$('#counter').html(timeleft);


        $('#startVideo').text(timeleft);
        timeleft -= 1;
      }, 1000);
    }
  }, {
    key: "checkActivity",
    value: function checkActivity(player, sliderObj) {
      var object = this; //TO DO: why not used?

      var timecheck = object.options.timecheck - 1;
      var moved = false;

      if (object.checks <= object.options.warningsAmount) {
        player.on('timeupdate', function () {
          var second = Math.floor(player.currentTime());

          if (sliderObj.slider('value') !== object.options.scaleStart) {
            moved = true;
          }

          if (object.checks <= object.options.warningsAmount && second === object.options.timecheck && !moved) {
            //restart video
            player.pause();
            sliderObj.slider({
              disabled: true
            });
            $('#counter').html('');
            $('#popup-content').html('' + '<p>You don\'t seem to have moved your slider. Please click ‘Reset’ to restart this task again.</p>' + '<button type="button" id="restartVideo">Reset</button>');
            $('#popup').removeClass('hide');
            $('body').css('overflow', 'hidden');
          }
        });

        if (!moved) {
          object.checks++;
        }
      }

      $('body').on('click', '#restartVideo', function () {
        object.closePopup();
        $('#startVideo').text("Play");
        object.generateSparklines(object.videoDuration);
        object.restartVideo(player, sliderObj);
      });
    }
  }, {
    key: "closePopup",
    value: function closePopup() {
      $('#popup').addClass('hide');
      $('body').css('overflow', 'auto');
    } //restart video

  }, {
    key: "restartVideo",
    value: function restartVideo(player, sliderObj) {
      player.currentTime(0);
      this.playerCycle(player, sliderObj);
    } //setInterval(function, milliseconds, param1, param2, ...)
    //var startDataTimer;

  }, {
    key: "collectData",
    value: function collectData(player, videoLength, sliderObj) {
      //console.log('collectData started');
      var videoAsnwers = [];
      var object = this;
      player.on('timeupdate', function () {
        var second = Math.floor(player.currentTime()); //console.log(second + " == " + sliderObj.slider('value'));

        if (second >= 1) {
          videoAsnwers[second - 1] = sliderObj.slider('value');
          var val = sliderObj.slider('value');

          if (val > 0) {
            var pc = val / object.options.scaleMax * 10;
            $("#spark-" + (second - 1)).css({
              "height": pc + "px",
              "margin-bottom": "10px",
              "background-color": "green"
            });
          } else if (val < 0) {
            var pc = val / object.options.scaleMin * 10;
            $("#spark-" + (second - 1)).css({
              "height": pc + "px",
              "margin-bottom": 10 - pc + "px",
              "background-color": "red"
            });
          } else {
            $("#spark-" + (second - 1)).css({
              "height": "2px",
              "margin-bottom": "9px",
              "background-color": "grey"
            });
          }
        }

        $('#timeRemain').html(object.setCounterMinutesDisplay(second));
      });
      player.on('ended', function () {
        $('.cf-navigation-next').attr('disabled', false);
        var data = this.checks + "|" + videoAsnwers;
        console.log(data);
        object.setQuestionValue(data, this);
      });
    }
  }, {
    key: "getOrientation",
    value: function getOrientation() {
      var orientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";
      return orientation;
    }
  }, {
    key: "setQuestionValue",
    value: function setQuestionValue(value, obj) {
      obj.question.validationCompleteEvent.on(function () {
        obj.question.setValue(value);
      });
    }
  }]);

  return MediaRatingQuestion;
}();
/* global register */


(function () {
  console.log("dev mode");
  var question = Confirmit.page.questions[0];
  var customQuestionSettings = {
    src: "https://vjs.zencdn.net/v/oceans.mp4",
    poster: "",
    countdown: 3,
    timecheck: 5,
    width: 640,
    sliderPosition: "bottom",
    scaleMin: -50,
    scaleMax: 50,
    scaleStart: 0,
    warningsAmount: 1,
    playButtonText: "Play",
    mediaType: "video",
    showSparklie: true
  };
  $(document).ready(function () {
    new MediaRatingQuestion(question, customQuestionSettings);
  });
})();
},{}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "localhost" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59107" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","components-dev.js"], null)
//# sourceMappingURL=/components-dev.js.map