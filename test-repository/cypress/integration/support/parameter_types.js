import { defineParameterType } from 'cytorus/src/Registry'
import { Color } from './types'

defineParameterType({
  name: 'color',
  regexp: /red/,
  transformer (s) {
    return new Color(s)
  }
})
