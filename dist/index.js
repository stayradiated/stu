'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = mock;
exports.flush = flush;
var unwire = require('../unwire/lib/unwire');
var caller = require('../unwire/lib/caller');
var sinon = require('sinon');

function mock(module) {
  return unwire.unwire(module, caller(), function (module) {
    if (typeof module === 'function') {
      return sinon.stub();
    } else {
      return sinon.stub(module);
    }
  });
}

function flush(module) {
  return unwire.flush(module, caller());
}