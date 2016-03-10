import sinon from 'sinon'
import {
  replaceWithContext,
  unwireWithContext,
  flushWithContext,
} from 'unwire'

const DEFAULT_FN_PROPS = [
  'length', 'name', 'arguments', 'caller', 'prototype',
]

export function getObjectKeys (obj) {
  return Object.getOwnPropertyNames(obj)
}

export function getFunctionKeys (fn) {
  return getObjectKeys(fn).filter((value) => {
    return DEFAULT_FN_PROPS.indexOf(value) < 0
  })
}

export function mockFunction (fn) {
  const mock = mockObject(fn, getFunctionKeys(fn), sinon.stub())
  if (fn.hasOwnProperty('prototype')) {
    const keys = getObjectKeys(fn.prototype)
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      if (key !== 'constructor') {
        mock.prototype[key] = sinon.stub()
      }
    }
  }
  return mock
}

export function mockObject (obj, keys, mock = {}) {
  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i]
    let val = obj[key]
    if (typeof val === 'function') {
      mock[key] = mockFunction(val)
    } else if (typeof val === 'object' && val !== null) {
      mock[key] = mockObject(val, getObjectKeys(val))
    } else {
      mock[key] = val
    }
  }
  return mock
}

export function mockModule (module) {
  let mock
  if (typeof module === 'function') {
    mock = mockFunction(module)
  } else {
    mock = mockObject(module, getObjectKeys(module))
  }
  return mock
}

export function mockModulePath (modulePath, context, options = {}) {
  const mock = options.mock != null ? options.mock : mockModule
  return unwireWithContext(modulePath, context, mock)
}

export function replaceModulePath (modulePath, context, options = {}) {
  const value = options.mock != null ? options.mock() : {}
  return replaceWithContext(modulePath, context, value)
}

export function mock (fn, context) {
  const modulePaths = new Set()

  const mock = function (modulePath, options = {}) {
    modulePaths.add(modulePath)
    if (options.replace) {
      return replaceModulePath(modulePath, context, options)
    }
    return mockModulePath(modulePath, context, options)
  }

  const test = function (modulePath) {
    modulePaths.add(modulePath)
    flushWithContext(modulePath, context)
    return unwireWithContext(modulePath, context)
  }

  const returnValue = fn(mock, test)

  return {modulePaths, returnValue}
}

export function cleanup (modules, context) {
  modules.forEach((module) => flushWithContext(module, context))
}
