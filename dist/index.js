'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
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
  if (typeof module === 'function') {
    return _sinon2['default'].stub();
  } else {
    return _sinon2['default'].stub(module);
  }
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