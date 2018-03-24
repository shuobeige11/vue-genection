/**
 * Created by root on 2017/7/12.
 */
import axios from 'axios'
import { API_FALID } from '../common/actionType'
import Toast from '@/toast'

// axios.interceptors.request.use(
//     config => {
//         let reg = new RegExp("(cms|st)\.(haiziwang|cekid)")
//         reg.test(config.url)?config.withCredentials=false:config.withCredentials=true;
//         Toast.show()
//         return config;
//     }, (error) => {
//         Toast.hide()
//         //console.error(' request error', error, error && error.request)
//         return Promise.reject(error)
//     })
export default store => {
  axios.interceptors.response.use((response) => {
    Toast.hide()
    if (response.data.code == 0 || response.data.start == 0 || response.data.errorCode == 0) {
        if(response.data.content){
            return Promise.resolve(response.data.content)
        }else if(response.data.data){
            return Promise.resolve(response.data.data)
        }
    }
    else if(response.data.code == 1001){
        return Promise.resolve(response.data.data)
    }
    else if (response.data.code == 1024) { // token expired
        window.location.href = '?cmd=login'
        return
    } else {
        store.commit(API_FALID, { data: response.data.msg })
        return
    }
  }, (error) => {
    Toast.hide()
    console.error(' response error', error, error && error.response)
    store.commit(API_FALID, { data:'网络错误' })
    return Promise.reject(error)
  })
}

