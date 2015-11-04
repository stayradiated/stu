import {getFullPath, unwire, flush} from 'unwire/dist/unwire';
import caller from 'unwire/dist/caller';
import sinon from 'sinon';

export function mockFunction (fn) {
  let mock = sinon.stub();
  if (fn.hasOwnProperty('prototype')) {
    const props = Object.getOwnPropertyNames(fn.prototype);
    for (let i = 0, len = props.length; i < len; i++) {
      let key = props[i];
      if (key !== 'constructor') {
        mock.prototype[key] = sinon.stub();
      }
    }
  }
  return mock;
}

export function mockObject (obj) {
  let mock = sinon.stub();
  const props = Object.getOwnPropertyNames(obj);
  for (let i = 0, len = props.length; i < len; i++) {
    let key = props[i];
    if (typeof obj[key] === 'function') {
      mock[key] = mockFunction(obj[key]);
    } else {
      mock[key] = obj;
    }
  }
  return mock;
}

export function mockModule (module) {
  let mock;
  if (typeof module === 'function') {
    mock = mockFunction(module);
  } else {
    mock = mockObject(module);
  }
  return mock;
}

export function cleanup (modules, context) {
  modules.forEach(module => flush(module, context));
}

export default function stu (fn) {
  const context = caller();

  const mocked = [];
  const required = [];

  const mock = function (module) {
    mocked.push(module);
    return unwire(module, context, mockModule);
  }

  const test = function (module) {
    required.push(module);
    const fullPath = getFullPath(module, context);

    flush(module, context);
    return require(fullPath);
  }

  const result = fn(mock, test);

  return cleanup.bind(null, [...mocked, ...required], context);
}
