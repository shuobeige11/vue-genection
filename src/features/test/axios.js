
import axios from 'axios'
import { store } from './store'
import services from '../../pluges/service'
services(store)

function plugin(Vue) {
    if (plugin.installed) {
      return
    }
    plugin.installed = true
    Object.defineProperties(Vue.prototype, {
      axios: {
        get () {
          return axios
        }
      },
      $http: {
        get () {
          return axios
        }
      }
    })
  }
  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin)
  }
  export default plugin