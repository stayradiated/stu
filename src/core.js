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

export function mockFunction (fn, cache) {
  const mock = Object.assign(
    sinon.stub(),
    mockObject(fn, getFunctionKeys(fn), cache))

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

export function mockObject (obj, keys, cache = new WeakMap()) {
  const mock = {}
  keys.forEach((key) => {
    const val = obj[key]

    let mockVal
    if (cache.has(val)) {
      mockVal = cache.get(val)
    } else if (typeof val === 'function') {
      cache.set(val, null)
      mockVal = mockFunction(val, cache)
      cache.set(val, mockVal)
    } else if (typeof val === 'object' && val !== null) {
      cache.set(val, null)
      mockVal = mockObject(val, getObjectKeys(val), cache)
      cache.set(val, mockVal)
    } else {
      mockVal = val
    }

    mock[key] = mockVal
  })
  return mock
}

export function mockModule (module) {
  const cache = new WeakMap()
  let mock
  if (typeof module === 'function') {
    mock = mockFunction(module, cache)
  } else {
    mock = mockObject(module, getObjectKeys(module), cache)
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
