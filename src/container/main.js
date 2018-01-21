import Vue from 'vue'
import http from 'axios'

import Toast from '../component/toast'
import App from './App'

const getQueryString = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
      r = window.location.search.substr(1).match(reg),
      context = '';
  if (r != null) {
      context = r[2];
  }
  reg = null;
  r = null;
  return context === null || context === '' || context === 'undefined' ? '' : context;
}

new Vue({
  data: {
    obj: null,
    brand: getQueryString('brand'),
    uid: getQueryString('uid'),
    hidephone: getQueryString('hidephone'),
    battleId: getQueryString('battleId'),
    msg: ''
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      Toast.show()
      try {
        // let data1 = await http.get('//')
        let url = '//rkhy.haiziwang.com/rkhy/memberDataExt/memberLabel.do?uid=' + this.uid
        if (this.battleId) {
          url = url + '&battleId=' + this.battleId
        }        

        let data = await http.get(url)
        data = data.data
        Toast.hide()
        if (data.code == 1024) {
          window.location.href = '?cmd=login'
        } else if (data.code == 10000) {
          if (!data.data.isAuth) {
            return window.location.replace( `//rkhy.haiziwang.com/member/detail-filter2.html?uid=${this.uid}&battleId=${this.battleId}`)
          }
          this.obj = data.data
        } else {
          this.msg = data.msg
        }
      } catch (e) {
        Toast.hide()
        this.msg = '发生网络错误！'
      }
    },
  },
  render(h) {
    return !this.obj && !this.msg ? null : h(App, {
      props: {
        obj: this.obj,
        brand: this.brand,
        uid: this.uid,
        hidephone: this.hidephone,
        battleId: this.battleId,
        msg: this.msg
      }
    })
  }
}).$mount('#app')