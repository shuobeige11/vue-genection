
import Vue from 'vue'
import VueRouter from 'vue-router'
import Mint from 'mint-ui'
import services from '../../pluges/service'
import { store } from './store'
import Router from './router'
import App from '../../common/App'
Vue.use(VueRouter)
Vue.use(services)
Vue.use(Mint)

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
