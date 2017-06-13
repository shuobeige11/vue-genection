import queryString from 'queryString'
import fetch from 'isomorphic-fetch'
import Promise from 'bluebird'

export default (url, obj) => {
      let query = queryString.stringify(obj)
      return new Promise((resolve, reject) => {
        
          try {
            fetch(url + '?' + query, {
                method: 'get',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json, text/plain, */*'
                }
            }).then(res => {
              return res.json()
            }).then(data => {
              let json = data
              if (json.code == 1) {
                resolve(json.data)
              } else {
                resolve(json.code)
                alert(json.msg)
              }
            })
        } catch (e) {
          alert('网络发生错误！' +  e)
        }
      })
    }