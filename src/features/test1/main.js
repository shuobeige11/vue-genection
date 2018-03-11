

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import Router from './router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: Router(),
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  // 更改iframe src fix bug
  if (document.getElementById('title_refresher')) {
    let titleRefresher = document.getElementById('title_refresher')
    titleRefresher.src = '//st.haiziwang.com/static/passport/0.1.1/favicon.ico'
  }
  next()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

