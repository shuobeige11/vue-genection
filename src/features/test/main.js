

import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import { store } from './store'
import Router from './router'
import App from '../../common/App'
import axios from './axios'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueRouter)
Vue.use(axios)
Vue.use(ElementUI)

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
  store,
  render: h => h(App)
}).$mount('#app')

