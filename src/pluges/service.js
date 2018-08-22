/**
 * Created by root on 2017/7/12.
 */
import axios from 'axios'
import Toast from '@/toast'
let defaultConfig = {
  needLoading: true
}
axios.interceptors.request.use(
  config => {
    Object.assign(defaultConfig, config)
    let reg = new RegExp('.(a)')
    reg.test(defaultConfig.url)
      ? (defaultConfig.withCredentials = false)
      : (defaultConfig.withCredentials = true)
    defaultConfig.needLoading ? Toast.show() : Toast.hide()
    return defaultConfig
  },
  error => {
    Toast.hide()
    return Promise.reject(error)
  }
)
export default store => {
  axios.interceptors.response.use(
    response => {
      Toast.hide()
      if (
        response.data.code == 0 ||
        response.data.start == 0 ||
        response.data.errorCode == 0
      ) {
        if (response.data.content) {
          return Promise.resolve(response.data.content)
        } else if (response.data.data) {
          return Promise.resolve(response.data.data)
        }
      } else if (response.data.result == 1001) {
        return Promise.resolve(response.data.data)
      } else if (response.data.result == -200) {
        // token expired
        // window.location.href = "?cmd=login";
        return false
      } else {
        store.commit('API_FALID', { data: response.data.errorMsg })
        return false
      }
    },
    error => {
      Toast.hide()
      console.error('response error', error, error && error.response)
      store.commit('API_FALID', { data: '网络错误' })
      return Promise.reject(error)
    }
  )
}
