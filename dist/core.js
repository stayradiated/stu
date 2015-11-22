'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.mockFunction = mockFunction;
exports.mockObject = mockObject;
exports.mockModule = mockModule;
exports.mockModulePath = mockModulePath;
exports.mock = mock;
exports.cleanup = cleanup;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _unwire = require('unwire');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function mockFunction(fn) {
  var mock = _sinon2['default'].stub();
  if (fn.hasOwnProperty('prototype')) {
    var props = Object.getOwnPropertyNames(fn.prototype);
    for (var i = 0, len = props.length; i < len; i++) {
      var key = props[i];
      if (key !== 'constructor') {
        mock.prototype[key] = _sinon2['default'].stub();
      }
    }
  }
  return mock;
}

function mockObject(obj) {
  var mock = _sinon2['default'].stub();
  var props = Object.getOwnPropertyNames(obj);
  for (var i = 0, len = props.length; i < len; i++) {
    var key = props[i];
    if (typeof obj[key] === 'function') {
      mock[key] = mockFunction(obj[key]);
    } else {
      mock[key] = obj;
    }
  }
  return mock;
}

function mockModule(module) {
  var mock = undefined;
  if (typeof module === 'function') {
    mock = mockFunction(module);
  } else {
    mock = mockObject(module);
  }
  return mock;
}

function mockModulePath(modulePath, context) {
  return (0, _unwire.unwireWithContext)(modulePath, context, mockModule);
}

function mock(fn, context) {
  var modulePaths = new Set();

  var mock = function mock(modulePath) {
    modulePaths.add(modulePath);
    return mockModulePath(modulePath, context);
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