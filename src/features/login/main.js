import Vue from 'vue'
import VueRouter from 'vue-router'
import MintUI from 'mint-ui'
import axios from 'axios'
import Router from './router'
import Home from './Home'

Vue.use(VueRouter)
Vue.use(plugin)
Vue.use(MintUI)

const router = new VueRouter({
  routes: Router()
})

router.beforeEach((to, from, next) => {
  // 更改iframe src fix bug
  if (document.getElementById('title_refresher')) {
    let titleRefresher = document.getElementById('title_refresher')
    titleRefresher.src = ''
  }
  next()
})

new Vue({
  router,
  render: h => h(Home)
}).$mount('#app')

function plugin (Vue) {
  if (plugin.installed) {
    return
  }
  plugin.installed = true
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return axios
      }
    }
  })
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
