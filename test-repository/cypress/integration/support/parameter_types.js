import { defineParameterType } from 'cytorus/src/Globals'
import { Color } from './types'

defineParameterType({
  name: 'color',
  regexp: /red/,
  transformer (s) {
    return new Color(s)
  }
})

defineParameterType({
  name: 'mob',
  regexp: /(?:\+91)?[0-9]{10}/,
  transformer (s) {
    return s
  }
})