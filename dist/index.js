'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.mockFunction = mockFunction;
exports.mockObject = mockObject;
exports.mockModule = mockModule;
exports.cleanup = cleanup;
exports['default'] = stu;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _unwireDistUnwire = require('unwire/dist/unwire');

var _unwireDistCaller = require('unwire/dist/caller');

var _unwireDistCaller2 = _interopRequireDefault(_unwireDistCaller);

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

function cleanup(modules, context) {
  modules.forEach(function (module) {
    return (0, _unwireDistUnwire.flush)(module, context);
  });
}

function stu(fn) {
  var context = (0, _unwireDistCaller2['default'])();

  var mocked = [];
  var required = [];

  var mock = function mock(module) {
    mocked.push(module);
    return (0, _unwireDistUnwire.unwire)(module, context, mockModule);
  };

  var test = function test(module) {
    required.push(module);
    var fullPath = (0, _unwireDistUnwire.getFullPath)(module, context);

    (0, _unwireDistUnwire.flush)(module, context);
    return require(fullPath);
  };

  var result = fn(mock, test);

  return cleanup.bind(null, [].concat(mocked, required), context);
}