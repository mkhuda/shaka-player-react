'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var shaka = _interopDefault(require('shaka-player/dist/shaka-player.ui'));
var React = _interopDefault(require('react'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var useInterval = function useInterval(callback, delay) {
  var savedCallback = React.useRef();
  React.useEffect(function () {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(function () {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      var id = setInterval(tick, delay);
      return function () {
        return clearInterval(id);
      };
    }
  }, [delay]);
};

/**
 * A React component for shaka-player.
 * @param {string} src
 * @param {shaka.extern.PlayerConfiguration} config
 * @param {boolean} autoPlay
 * @param {number} width
 * @param {number} height
 * @param ref
 * @returns {*}
 * @constructor
 */

function ShakaPlayer(_ref, ref) {
  var src = _ref.src,
      config = _ref.config,
      uiConfig = _ref.uiConfig,
      chromeless = _ref.chromeless,
      className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["src", "config", "uiConfig", "chromeless", "className"]);

  var uiContainerRef = React.useRef(null);
  var videoRef = React.useRef(null);

  var _React$useState = React.useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      player = _React$useState2[0],
      setPlayer = _React$useState2[1];

  var _React$useState3 = React.useState(null),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      ui = _React$useState4[0],
      setUi = _React$useState4[1];

  var _React$useState5 = React.useState(null),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      playerstate = _React$useState6[0],
      setPlayerStat = _React$useState6[1];

  var _React$useState7 = React.useState(0),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      seconds = _React$useState8[0],
      setSeconds = _React$useState8[1];

  useInterval(function () {
    if (player) {
      console.log(player.getStats());
      setSeconds(seconds + 1);
    }
  }, 1000); // Effect to handle component mount & mount.
  // Not related to the src prop, this hook creates a shaka.Player instance.
  // This should always be the first effect to run.

  React.useEffect(function () {
    var player = new shaka.Player(videoRef.current);
    setPlayer(player);

    if (!chromeless) {
      var _ui = new shaka.ui.Overlay(player, uiContainerRef.current, videoRef.current);

      setUi(_ui);
    }

    return function () {
      player.destroy();
    };
  }, []); // Keep shaka.Player.configure in sync.

  React.useEffect(function () {
    if (player && config) {
      player.configure(config);
    }
  }, [player, config]); // Keep shaka.Player.ui in sync.

  React.useEffect(function () {
    if (player && ui) {
      ui.configure(uiConfig);
    }
  }, [player, uiConfig]); // Load the source url when we have one.

  React.useEffect(function () {
    if (player && src) {
      player.load(src);
    }
  }, [player, src]); // Define a handle for easily referencing Shaka's player & ui API's.

  React.useImperativeHandle(ref, function () {
    return {
      get player() {
        return player;
      },

      get ui() {
        return ui;
      },

      get videoElement() {
        return videoRef.current;
      }

    };
  }, [player, ui]);
  return /*#__PURE__*/React.createElement("div", {
    ref: uiContainerRef,
    className: className
  }, /*#__PURE__*/React.createElement("video", _extends({
    ref: videoRef,
    style: {
      maxWidth: '100%',
      width: '100%'
    }
  }, rest)));
}

var index = /*#__PURE__*/React.forwardRef(ShakaPlayer);

module.exports = index;
