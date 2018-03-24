import axios from 'axios'
import { API_LIST } from '../api'

const actinType = {
  GET_API_TEST: 'GET_API_TEST'  
}

const state = {
  list: []
}

const getters = {
  list: state => state.list
}

const actions = {
  async getMessage({ }) {
    let r = await axios.get(API_LIST)
  }  
}

const mutations = {
  [actinType.GET_API_TEST](state, data) {
     state.list = data 
  }  
}

export default {
  state,
  getters,
  actions,
  mutations
}