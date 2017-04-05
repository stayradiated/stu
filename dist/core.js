'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getObjectKeys = getObjectKeys;
exports.getFunctionKeys = getFunctionKeys;
exports.mockFunction = mockFunction;
exports.mockObject = mockObject;
exports.mockModule = mockModule;
exports.mockModulePath = mockModulePath;
exports.replaceModulePath = replaceModulePath;
exports.mock = mock;
exports.cleanup = cleanup;

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _unwire = require('unwire');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_FN_PROPS = ['length', 'name', 'arguments', 'caller', 'prototype'];

function getObjectKeys(obj) {
  return Object.getOwnPropertyNames(obj);
}

function getFunctionKeys(fn) {
  return getObjectKeys(fn).filter(function (value) {
    return DEFAULT_FN_PROPS.indexOf(value) < 0;
  });
}

function mockFunction(fn, cache) {
  var mock = Object.assign(_sinon2.default.stub(), mockObject(fn, getFunctionKeys(fn), cache));

  if (fn.hasOwnProperty('prototype')) {
    var keys = getObjectKeys(fn.prototype);
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      if (key !== 'constructor') {
        mock.prototype[key] = _sinon2.default.stub();
      }
    }
  }
  return mock;
}

function mockObject(obj, keys) {
  var cache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new WeakMap();

  var mock = {};
  keys.forEach(function (key) {
    var val = obj[key];

    var mockVal = void 0;
    if (cache.has(val)) {
      mockVal = cache.get(val);
    } else if (typeof val === 'function') {
      cache.set(val, null);
      mockVal = mockFunction(val, cache);
      cache.set(val, mockVal);
    } else if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val !== null) {
      cache.set(val, null);
      mockVal = mockObject(val, getObjectKeys(val), cache);
      cache.set(val, mockVal);
    } else {
      mockVal = val;
    }

    mock[key] = mockVal;
  });
  return mock;
}

function mockModule(module) {
  var cache = new WeakMap();
  var mock = void 0;
  if (typeof module === 'function') {
    mock = mockFunction(module, cache);
  } else {
    mock = mockObject(module, getObjectKeys(module), cache);
  }
  return mock;
}

function mockModulePath(modulePath, context) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var mock = options.mock != null ? options.mock : mockModule;
  return (0, _unwire.unwireWithContext)(modulePath, context, mock);
}

function replaceModulePath(modulePath, context) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var value = options.mock != null ? options.mock() : {};
  return (0, _unwire.replaceWithContext)(modulePath, context, value);
}

function mock(fn, context) {
  var modulePaths = new Set();

  var mock = function mock(modulePath) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    modulePaths.add(modulePath);
    if (options.replace) {
      return replaceModulePath(modulePath, context, options);
    }
    return mockModulePath(modulePath, context, options);
  };

  var test = function test(modulePath) {
    modulePaths.add(modulePath);
    (0, _unwire.flushWithContext)(modulePath, context);
    return (0, _unwire.unwireWithContext)(modulePath, context);
  };

  var returnValue = fn(mock, test);

  return { modulePaths: modulePaths, returnValue: returnValue };
}

function cleanup(modules, context) {
  modules.forEach(function (module) {
    return (0, _unwire.flushWithContext)(module, context);
  });
}