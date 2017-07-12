'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stu;

var _caller = require('caller');

var _caller2 = _interopRequireDefault(_caller);

var _core = require('./core');

var _unwire = require('unwire');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function stu(legacyFn) {
  var context = (0, _caller2.default)();
  var modulePaths = new Set();

  var exports = {
    mock: function mock() {
      var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : legacyFn;

      var result = (0, _core.mock)(fn, context);
      modulePaths = new Set([].concat(_toConsumableArray(modulePaths), _toConsumableArray(result.modulePaths)));
      return result.returnValue;
    },
    flush: function flush() {
      modulePaths.forEach(function (modulePath) {
        return (0, _unwire.flushWithContext)(modulePath, context);
      });
    },
    mocha: function mocha() {
      after(exports.flush);
      beforeEach(exports.mock);
    }
  };

  return exports;
}