const unwire = require('../unwire/lib/unwire');
const caller = require('../unwire/lib/caller');
const sinon = require('sinon');

export default function mock (module) {
  return unwire.unwire(module, caller(), function (module) {
    if (typeof module === 'function') {
      return sinon.stub();
    } else {
      return sinon.stub(module);
    }
  });
}

export function flush (module) {
  return unwire.flush(module, caller());
}
