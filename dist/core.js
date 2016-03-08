'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

function mockFunction(fn) {
  var mock = _sinon2.default.stub();
  if (fn.hasOwnProperty('prototype')) {
    var props = Object.getOwnPropertyNames(fn.prototype);
    for (var i = 0, len = props.length; i < len; i++) {
      var key = props[i];
      if (key !== 'constructor') {
        mock.prototype[key] = _sinon2.default.stub();
      }
    }
  }
  return mock;
}

function mockObject(obj) {
  var mock = _sinon2.default.stub();
  var props = Object.getOwnPropertyNames(obj);
  for (var i = 0, len = props.length; i < len; i++) {
    var key = props[i];
    if (typeof obj[key] === 'function') {
      mock[key] = mockFunction(obj[key]);
    } else {
      mock[key] = obj[key];
    }
  }
  return mock;
}

function mockModule(module) {
  var mock = void 0;
  if (typeof module === 'function') {
    mock = mockFunction(module);
  } else {
    mock = mockObject(module);
  }
  return mock;
}

function mockModulePath(modulePath, context) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var mock = options.mock != null ? options.mock : mockModule;
  return (0, _unwire.unwireWithContext)(modulePath, context, mock);
}

function replaceModulePath(modulePath, context) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var value = options.mock != null ? options.mock() : {};
  return (0, _unwire.replaceWithContext)(modulePath, context, value);
}

function mock(fn, context) {
  var modulePaths = new Set();

  var mock = function mock(modulePath) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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