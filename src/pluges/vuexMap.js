import { mapGetters, mapState, mapActions } from 'vuex'
import { createDecorator } from 'vue-class-component'

export const MapGetters = options => {
  if (options === void 0) { options = {} }
  return createDecorator((componentOptions) => {
    if (typeof componentOptions.computed !== 'object') {
      componentOptions.computed = Object.create(null)
    }
    componentOptions.computed = { ...mapGetters(options) }
  })
}

export const MapStates = options => {
  if (options === void 0) { options = {} }
  return createDecorator((componentOptions) => {
    if (typeof componentOptions.computed !== 'object') {
      componentOptions.computed = Object.create(null)
    }
    componentOptions.computed = { ...mapState(options) }
  })
}

export const MapActions = options => {
  if (options === void 0) { options = {} }
  return createDecorator((componentOptions) => {
    if (typeof componentOptions.methods !== 'object') {
      componentOptions.methods = Object.create(null)
    }
    componentOptions.methods = { ...mapActions(options) }
  })
}
