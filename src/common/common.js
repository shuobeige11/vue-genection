import Vue from 'vue'
import {
API_FALID,
API_MSG_CLEAR,
API_ALERT_SHOW,
API_ALERT_HIDDEN,
API_COMMON_PAGINATION_SUCCESS,
API_COMMON_PAGINATION_FAILE,
API_COMMON_PAGINATION_NOMESSAGE } from './actionType'


const state = {
  codeMsg: '',
  alertMessage: null,
  more: true,
  noOrder: false
}

const getters = {
  codeMsg: state => state.codeMsg,
  alertMessage: state => state.alertMessage,
  more: state => state.more,
  noOrder: state => state.noOrder
}

const mutations = {
  [API_FALID] (state, { data }) {
     state.codeMsg = data
  },
  [API_MSG_CLEAR] (state) {
    state.codeMsg = ''
  },
  [API_ALERT_SHOW] (state, data) {
    state.alertMessage = data.data
  },
  [API_ALERT_HIDDEN] (state) {
    state.alertMessage = null
  },
  [API_COMMON_PAGINATION_SUCCESS] (state) {
    state.noOrder = false
    state.more = true
  },
  [API_COMMON_PAGINATION_FAILE] (state) {
    state.noOrder = true
    state.more = false
  }
}

const actions = {
  getStoreMessage({ commit, state }) {
      return new Promise((resolve, reject) => {
          getStoreMessage((code, data) => {
              if (code == 10000) {
                  resolve(data)
              }
          })()
      })
  },
  msgClear({ commit, state }) {
    commit(API_MSG_CLEAR)
  },
  alerthide({ commit, state }) {
    commit(API_ALERT_HIDDEN)
  },
  alertshow({ commit, state }, data) {
    commit(API_ALERT_SHOW, { data })
  }
}


function getStoreMessage(cb) {
    return async () => {
        try {
            let res = await Vue.http.get('//st.haiziwang.com/data/front/detail-city-store.json')
            //let data = await res
            //console.log(res)
            cb && cb(10000,res)
        } catch (e) {
            console.log(e)
            cb && cb(9999, '网络发生错误！')
        }
    }
}

export default {
  state,
  getters,
  mutations,
  actions
}
