import axios from 'axios'

const state = {
  list: []
}

const getters = {
  list: state => state.list
}

const actions = {
  async getMessage () {
    let r = await axios.get('/')
    console.log(r)
  }
}

const mutations = {
  GET_API_TEST (state, data) {
    state.list = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
