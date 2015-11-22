'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = stu;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _caller = require('caller');

var _caller2 = _interopRequireDefault(_caller);

var _core = require('./core');

var _unwire = require('unwire');

function stu(fn) {
  var context = (0, _caller2['default'])();
  var modulePaths = new Set();

  return {
    mock: function mock() {
      var result = (0, _core.mock)(fn, context);
      modulePaths = new Set([].concat(_toConsumableArray(modulePaths), _toConsumableArray(result.modulePaths)));
      return result.returnValue;
    },
    flush: function flush() {
      modulePaths.forEach(function (modulePath) {
        return (0, _unwire.flushWithContext)(modulePath, context);
      });
    }
  };
}

module.exports = exports['default'];