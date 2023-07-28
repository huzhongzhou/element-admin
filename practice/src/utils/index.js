/**
 * Created by PanJiaChen on 16/11/18.
 */

// import checkPermission from '@/utils/permission'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @param {string} str
 * @returns {string | null}
 */
export function parseTime(time, cFormat, str = '') {
  if (arguments.length === 0 || !time) {
    return str
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * 表格时间格式化
 */
export function formatDate1(cellValue) {
  if (cellValue === null || cellValue === '') return ''
  var date = new Date(cellValue)
  var year = date.getFullYear()
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  return year + '' + month + '' + day
}
/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * 清理空值，对象
 * @param children
 * @returns {*[]}
 */
export function filterEmpty(children = []) {
  return children.filter(c => c.tag || (c.text && c.text.trim() !== ''))
}

/**
 * 获取字符串长度，英文字符 长度1，中文字符长度2
 * @param {*} str
 */
export const getStrFullLength = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1
    }
    return pre + 2
  }, 0)

/**
 * 截取字符串，根据 maxLength 截取后返回
 * @param {*} str
 * @param {*} maxLength
 */
export const cutStrByFullLength = (str = '', maxLength) => {
  let showLength = 0
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1
    } else {
      showLength += 2
    }
    if (showLength <= maxLength) {
      return pre + cur
    }
    return pre
  }, '')
}

export function getDateRange(dates, keys = ['startTime', 'endTime'], format = '{y}-{m}-{d} {h}:{i}:{s}') {
  const obj = {}
  dates = dates || []
  keys.forEach((item, index) => {
    obj[item] = dates[index] ? parseTime(dates[index], format) : null
  })
  return obj
}

export function mapDict(list, vKey = 'value', lKey = 'label') {
  if (!(list instanceof Array)) return []
  return list.map(item => ({ [vKey]: item, [lKey]: item }))
}

export function mapDictVL(list, svKey = 'code', slKey = 'name', vKey = 'value', lKey = 'label') {
  if (!(list instanceof Array)) return []
  return list.map(item => ({ [vKey]: item[svKey], [lKey]: item[slKey] }))
}

// 由key转换dict的label
export function dictLabel(key, dict, vKey = 'value', lKey = 'label') {
  if (!(dict instanceof Array)) dict = []
  return (!isEmpty(key)) ? (dict.find(item => item[vKey] === key) || { [lKey]: key })[lKey] : key
}
export function mapValue(list) {
  if (!(list instanceof Array)) return []
  const obj = {}
  list.map(item => (obj[item.value] = item.label))
  return obj
}

export function isEmpty(str) {
  return (str === undefined) || (str === null) || (str === '')
}

export function toFun(promise) {
  return promise.then(data => {
    return [null, data]
  }).catch(err => [err])
}

export function formatNumber(num, cent = 2, isThousand = true) {
  if (!num) return num
  num = num.toString().replace(/\$|\,/g, '')
  if (isNaN(num)) { num = '0' }
  num = Math.floor(num * Math.pow(10, cent) + 0.50000000001)
  let cents = num % Math.pow(10, cent)
  num = Math.floor(num / Math.pow(10, cent)).toString()
  cents = cents.toString()
  while (cents.length < cent) { cents = '0' + cents }
  if (isThousand) {
    for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) { num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3)) }
  }
  if (cent > 0) { return (num + '.' + cents) } else { return num }
}

export function toFixedPlus(number, m) {
  if (typeof number !== 'number') {
    throw new Error('number不是数字')
  }
  let result = Math.round(Math.pow(10, m) * number) / Math.pow(10, m)
  result = String(result)
  if (result.indexOf('.') === -1) {
    if (m !== 0) {
      result += '.'
      result += new Array(m + 1).join('0')
    }
  } else {
    const arr = result.split('.')
    if (arr[1].length < m) {
      arr[1] += new Array(m - arr[1].length + 1).join('0')
    }
    result = arr.join('.')
  }
  return result
}

// export function authEnum(value) {
//   return checkPermission(value)
// }

// 字符串截取最后一个/并获取后面的值
export function getStr(str) {
  return str.substring(str.lastIndexOf('\/') + 1, str.length)
}

// 转换表单对象,移除空属性
export function cleanForm(obj) {
  Object.keys(obj).map(item => {
    if (obj[item]) {
      if (obj[item] instanceof Array && obj[item].length === 0) {
        delete obj[item]
      }
    } else {
      delete obj[item]
    }
  })
  return obj
}

// 空数据字段用'-'显示
export function doReplace(value) {
  // console.log(Object.prototype.toString.call(value))
  if (Object.prototype.toString.call(value) === '[object Object]') {
    for (const obj in value) {
      if (value[obj] === '' || value[obj] === null || value[obj] === undefined) {
        value[obj] = '-'
      }
    }
    return value
  } else if (Object.prototype.toString.call(value) === '[object Array]') {
    value.forEach(item => {
      Object.keys(item).forEach(k => {
        if (item[k] === '' || item[k] === null || item[k] === undefined) {
          item[k] = '-'
        }
      })
    })
    return value
  } else {
    return value
  }
}

/**
 * describe:  手机号中间四位显示*
 */
export function starPhone(phoneNum) {
  let str = String(phoneNum)
  var reg = /^\d{3}(\d{4})\d{4}$/
  str = str.replace(reg, '***$1****') // 隐藏前面3位，最后4位
  // str = str.replace(reg, '$1****$2')  // 隐藏中间4位
  return str
}
/**
 * describe:  数字千分位
 */
export function ThousandthPercentile(num) {
  if (num === null) {
    num = 0
    return num
  } else {
    if (num !== undefined) {
      num = num.replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,')
      return num
    }
  }
}

export const validateEmail = (email) => {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5\-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}

export const validatePhoneNumber = (text) => {
  const phone = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
  const mobile = /^1\d{10}$/
  return phone.test(text) || mobile.test(text)
}

export function getRedirectUrl() {
  const host = location.host
  let url = ''
  if (host === '10.220.0.64') {
    url = `https://iam.hnjrkg.com/idp/oauth2/authorize?client_id=JTCRM&redirect_uri=${encodeURIComponent('http://10.220.0.64/#/auth-redirect')}&state=&response_type=code`
  } else if (host === '10.220.0.91') {
    url = `https://iam.hnjrkg.com/idp/oauth2/authorize?client_id=JTCRM&redirect_uri=${encodeURIComponent('http://10.220.0.91/#/auth-redirect')}&state=&response_type=code`
  } else if (host === 'em.hnchasing.com') {
    url = `https://iam.hnchasing.com/idp/oauth2/authorize?client_id=JTCRM&redirect_uri=${encodeURIComponent('http://em.hnchasing.com/#/auth-redirect')}&state=&response_type=code`
  } else {
    url = `https://iam.hnjrkg.com/idp/oauth2/authorize?client_id=JTCRM&redirect_uri=${encodeURIComponent('http://localhost:9527/#/auth-redirect')}&state=&response_type=code`
  }
  return url
}
export function objFilterNull(obj) {
  const newObj = {}
  for (const i in obj) {
    if (obj[i]) {
      if (Array.isArray(obj[i])) {
        if (obj[i].length) {
          newObj[i] = obj[i]
        }
      } else {
        newObj[i] = obj[i]
      }
    }
  }
  return newObj
}

export function convert(data, key = 'id', parentId = 'parentId') {
  const result = []
  if (!Array.isArray(data)) {
    return result
  }
  data.forEach(item => {
    delete item.children
  })
  const map = {}
  data.forEach(item => {
    map[item[key]] = item
  })
  data.forEach(item => {
    const parent = map[item[parentId]]
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      result.push(item)
    }
  })
  return result
}
