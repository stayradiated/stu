'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.mockModule = mockModule;
exports.cleanup = cleanup;
exports['default'] = stu;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _unwireDistUnwire = require('unwire/dist/unwire');

var _unwireDistCaller = require('unwire/dist/caller');

var _unwireDistCaller2 = _interopRequireDefault(_unwireDistCaller);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function mockModule(module) {
  var mock = undefined;
  if (typeof module === 'function') {
    mock = _sinon2['default'].stub();
    var props = Object.getOwnPropertyNames(module.prototype);
    for (var i = 0, len = props.length; i < len; i++) {
      var key = props[i];
      if (key !== 'constructor') {
        mock.prototype[key] = _sinon2['default'].stub();
      }
    }
  } else {
    mock = _sinon2['default'].stub(_extends({}, module));
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
    return require(fullPath);
  };

  var result = fn(mock, test);

  // remove all required modules from cache
  cleanup(required, context);

  return cleanup.bind(null, mocked, context);
}