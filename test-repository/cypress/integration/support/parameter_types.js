import { defineParameterType } from 'cytorus/src/Globals'
import { Color } from './types'

defineParameterType({
  name: 'color',
  regexp: /red/,
  transformer (s) {
    return new Color(s)
  }
})
