const REGEXP_TELEPHONE = /^\d{3}-\d{8}$|^\d{4}-\d{7,8}$/
const REGEXP_MOBILE = /^1[34578]\d{9}$/
const REGEXP_USC = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/
import moment from 'moment'

/**
 *
 * @param item
 * @param val
 * @param hide
 * @return {Array}
 * @example
 * basic useage
 * let item = {key: contract, validator: {required: [true], rules: {phone: 'mobile'}, ignore: this.isCheck}};
 * let val = '13770707613'
 * let invalidVal = '13770707'
 * validator(item, val) // => [] //ok
 * validator(item, invalidVal) // => ['phone'] //invalid
 *
 *
 * let hideItem = {required: true, rules: {phone: 'mobile'}};
 * let invalidVal = '13770707'
 * validator(hideItem, invalidVal, true) // => [] //ok
 */
export const validator = (item, val, hide) => {
  if (Array.isArray(item)) {
    let ret = {}
    for (let i = 0, il = item.length; i < il; i++) {
      Object.assign(ret, handle(item[i], item[i].val, item[i].hide))
    }
    return ret
  } else {
    return handle(item, val, hide)
  }
}

const handle = (item, val, hide) => {
  if (!item) return {}
  if (item.isRange && item.items.length) {
    let ret = {}
    for (let i = 0, il = item.items.length; i < il; i++) {
      Object.assign(ret, vali(item.items[i], item.items[i].val, item.items[i].hide))
    }
    return ret
  } else {
    return vali(item, val, hide)
  }
}

const vali = (item, val, hide) => {
  let validatorRet = []
  let ret = {}
  if (!item.validator || hide || item.validator.ignore) return ret
  // console.log(item.key, val)
  if (item.validator.rules && !Object.keys(item.validator.rules).length) {
    console.error('validator need params', item)
    return ret
  }
  if (item.validator.required && item.validator.required[0]) {
    if (val === '' || val === null || val === undefined || (typeof val === 'object' && Object.keys(val).length < 1)) {
      validatorRet.push(item.validator.required[1] || '必填')
      ret[item.key] = validatorRet
      return ret
    }
  }
  for (const rule in item.validator.rules) {
    let params = item.validator.rules[rule]
    /**
     * array_len_range:[min[, max, tips]]
     */
    if (rule === 'array_len_range') {
      if (!Array.isArray(val)) throw new Error('validator array_len_range need a array')
      if (!params.length || params[0] < 0 || params[1] < 0) throw new Error('validator array_len_range need params')
      let min = Math.max(0, params[0])
      if (val.length < min || (params[1] && val.length > params[1])) {
        validatorRet.push(params[2] || (params[1] ? `请填写${min} ~ ${params[1]}` : `请至少选择${min}个`))
      }
    }
    /**
     * str_len_range:[min, max[, tips]]
     * {
              title: '公司名称',
              type: 'input',
              key: 'companyName',
              val: '',
              validator: {required: [true], rules: {str_len_range: [2, 30]}, ignore: this.isCheck}
        },
     */
    if (rule === 'str_len_range') {
      if (!params.length || params[0] < 0 || !params[1]) throw new Error('validator str_len_range need params')
      let min = Math.max(0, params[0])
      if (typeof val !== 'string' || val.length < min || val.length > params[1]) {
        validatorRet.push(params[2] || `请填写${min} ~ ${params[1]}`)
      }
    }
    /**
     * num_range:[min, max[, tips]]
     */
    if (rule === 'num_range') {
      if (!params.length) throw new Error('validator num_range need params')
      if (typeof val !== 'number' || val.length < params[0] || val.length > params[1]) {
        validatorRet.push(params[2] || `请填写${params[0]} ~ ${params[1]}`)
      }
    }
    /**
     * phone:[type[, tips]] //type: mobile, tel . Default is both.
     */
    if (rule === 'phone') {
      if (!params.length) throw new Error('validator phone need params')
      switch (params[0]) {
        case 'mobile':
          if (!REGEXP_MOBILE.test(val)) {
            validatorRet.push(params[1] || `请填写正确的手机号`)
          }
          break
        case 'tel':
          if (!REGEXP_TELEPHONE.test(val)) {
            validatorRet.push(params[1] || `请填写正确的电话号码，如025-88886699`)
          }
          break
        default :
          if (!REGEXP_TELEPHONE.test(val) && !REGEXP_MOBILE.test(val)) {
            validatorRet.push(params[1] || '请填写正确的手机号或电话号码，如025-88886699')
          }
          break
      }
    }
    /**
     * url:[[tips]]
     */
    if (rule === 'url') {
      if (!/^((https?|ftp|file):\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(val)) {
        validatorRet.push(params[0] || `请填写正确的网址。`)
      }
    }
    /**
     * date:[{startDate:'',endDate:'',tips:''}]
     * date:{startDate:'',endDate:'',tips:''}
     * {
              title: '活动时间',
              type: 'startEndDate',
              isRange: true,
              items: [
                {
                  type: 'start',
                  val: '',
                  validator: {required: [true], ignore: this.isCheck},
                  key: 'actSttime'
                },
                {
                  type: 'end',
                  val: '',
                  validator: {required: [true], rules: {date: {startDate: this.mainData['actSttime']}}, ignore: this.isCheck},
                  key: 'actEdtime'
                }
              ]
            },
     * {
              title: '执行时间',
              type: 'startEndDate',
              isRange: true,
              items: [
                {
                  type: 'start',
                  val: '',
                  validator: {required: [true], rules: {date: {startDate: this.mainData['actSttime'], endDate: this.mainData['actEdtime']}}, ignore: this.isCheck},
                  key: 'exeSttime'
                },
                {
                  type: 'end',
                  val: '',
                  validator: {required: [true], rules: {date: [{startDate: this.mainData['actSttime'], endDate: this.mainData['actEdtime']}, {startDate: this.mainData['exeSttime']}]}, ignore: this.isCheck},
                  key: 'exeEdtime'
                }
              ]
            }
     */
    if (rule === 'date') {
      if (Array.isArray(params)) {
        for (let i = 0, il = params.length; i < il; i++) {
          let r = checkDate(params[i], val)
          if (r) validatorRet.push(r)
        }
      } else {
        let r = checkDate(params, val)
        if (r) validatorRet.push(r)
      }
    }
    /**
     * GB_32100-2015_法人和其他组织统一社会信用代码编码规则
     *  {
              title: '统一社会信用代码',
              type: 'unifiedSocialCreditCode',
              validator: {required: [true], rules: {unifiedSocialCreditCode: ['请填写18位统一社会信用代码']}, ignore: this.isCheck},
              key: 'creditCode',
              hide: !this.isCoop
       },
     */
    if (rule === 'unifiedSocialCreditCode') {
      // data = "91350100M000100Y43,91430382092581024J,914103057167119596,9A350100M000100Y47,91340828578527976Q,91350128M00000019A,52100000523000026F,91350200M000000510,91520421MA6DJ09246,91440300359143307G,91340881MA2MQ0T315"
      if (!REGEXP_USC.test(val)) {
        validatorRet.push(params[0] || '请填写正确的统一社会信用代码')
      }
    }

    /**
     * 自定义正则校验
     * validator: {required: [true], rules: {customRegexp: [/^\d$/, '请填写数字']}},
     */
    if (rule === 'customRegexp') {
      if (!params[0] || !params[1]) throw new Error('validator customRegexp need params')
      if (!new RegExp(params[0]).test(val)) {
        validatorRet.push(params[1])
      }
    }
  }

  if (validatorRet.length) ret[item.key] = validatorRet
  return ret
}

const checkDate = (params, val) => {
  if (!params || (!params.startDate && !params.endDate)) throw new Error('validator date need params')
  let date = moment(val)
  if (params.startDate && params.endDate) {
    let startDate = moment(params.startDate)
    let endDate = moment(params.endDate)
    if (!date.isBetween(startDate, endDate, null, '[]')) {
      return (params.tips || `请选择${params.startDate} ～ ${params.endDate}之间日期。`)
    }
  } else if (params.endDate) {
    let endDate = moment(params.endDate)
    if (date.isAfter(endDate)) return (params.tips || `不能晚于 ${params.endDate}。`)
  } else if (params.startDate) {
    let startDate = moment(params.startDate)
    if (date.isBefore(startDate)) return (params.tips || `不能早于 ${params.startDate}。`)
  }
}


export const formatDate = (value,type) => {
    let format = ''
    switch (type) {
      case 'day': format = 'YYYY-MM-DD'
        break
      case 'second': format = 'YYYY-MM-DD HH:MM:SS'
        break
      default : format = type
        break
    }
    return moment(value).format(format)
  
  }
  export const fromNow = (value) => {
    return moment(value).fromNow();
  }
  
  export const getQueryString = (name) => {
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
  
  //手机号136****1221
  export const getFiterPhone = phone => {
    return phone.replace(/(\d{3})(?=\d{4})(?:\d{4})/, '$1****') 
  }
  
  export const formatToParams = obj => {
    const arr = []
    for (let key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue
      }
      arr.push(`${key}=${obj[key]}`)
    }
    return arr.join('&')
  }
  
  export const tofixed = value => {
    value = value.toString()
    return parseFloat(value.replace(/(\d+)\./,'$1')) / ( Math.pow(10, value.length + 1) / Math.pow(10, value.length - 1))
  }
  
  export const cutNumber = value => {
    return value.toString().replace(/\B(?=(\d{3})+(?!(\d)))/g, ',')
  }