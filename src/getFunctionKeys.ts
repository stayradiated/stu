import getObjectKeys from './getObjectKeys'

const DEFAULT_FN_PROPS = ['length', 'name', 'arguments', 'caller', 'prototype']

const getFunctionKeys = (fn: Function) => {
  return getObjectKeys(fn).filter((value: string) => {
    return DEFAULT_FN_PROPS.indexOf(value) < 0
  })
}

export default getFunctionKeys
