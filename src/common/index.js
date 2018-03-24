import {
  API_FALID,
  API_MSG_CLEAR
} from './actionType' 

const state = {
  codeMsg: ''
}

const getters = {
  codeMsg: state => state.codeMsg
}

const mutations = {
  [API_FALID] (state, { data }) {
    state.codeMsg = data
  },
  [API_MSG_CLEAR] (state) {
    state.codeMsg = ''
  }
}

const actions = {
  msgClear({ commit, state }) {
    commit(API_MSG_CLEAR)
  },
  alertshow({ commit, state }, data) {
    commit(API_FALID, { data })
  }
}

export default {  
  state,
  getters,
  mutations,
  actions
}