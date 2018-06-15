

import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import axios from 'axios'
import services from '../../pluges/service'
import { store } from './store'
import Router from './router'
import App from '../../common/App'
import 'element-ui/lib/theme-chalk/index.css';

services(store)
Vue.use(VueRouter)
Vue.use(plugin)
Vue.use(ElementUI)

const router = new VueRouter({
  routes: Router(),
  mode: 'history'
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
  store,
  render: h => h(App)
}).$mount('#app')

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
      }
    })
  }
  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin)
  }