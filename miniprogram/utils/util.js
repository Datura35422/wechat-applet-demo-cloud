const formatDateTime = (date, hasTime) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  let result = [year, month, day].map(formatNumber).join('-')
  if (hasTime) {
    result = result + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  return result
}

const formatTime = (date, hasSecond) => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  let result = formatNumber(hour) + ':' + formatNumber(minute) + (hasSecond ? ":" + second : "")
  return result;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 利用位运算进行加密，位运算都会转为2进制进行计算
 */
const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8) // 0x3为16进制的3
    return v.toString(16)
  })
}

const findIndexById = (array, uuid) => {
  if (uuid) {
    for (let i in array) {
      if (array[i].uuid == uuid) {
        return i;
      }
    }
  }
  return -1
}

const getDate = date => {
  return date.getFullYear() + '-' + formatNumber(date.getMonth() + 1) + '-' + formatNumber(date.getDate())
}

const getTime = (date) => {
  return formatNumber(date.getHours()) + ':' + formatNumber(date.getMinutes())
}

const setDate = (str, date) => {
  if (typeof (date) != typeof (Date)) {
    date = new Date(date)
  }
  console.log(typeof (str), str)
  console.log(typeof (date), date)
  let [year, month, day] = str.split('-')
  date.setFullYear(parseInt(year))
  date.setMonth(parseInt(month) - 1)//因为月份是从0开始的
  date.setDate(parseInt(day))
}

const setTime = (str, date) => {
  if (typeof (date) != typeof (Date)) {
    date = new Date(date)
  }
  let [hour, minute] = str.split(':')
  date.setHours(parseInt(hour))
  date.setMinutes(parseInt(minute))
}

const stringToByte = str => {
  var bytes = new Array();
  var len, c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10FFFF) {
      bytes.push(((c >> 18) & 0x07) | 0xF0);
      bytes.push(((c >> 12) & 0x3F) | 0x80);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00FFFF) {
      bytes.push(((c >> 12) & 0x0F) | 0xE0);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007FF) {
      bytes.push(((c >> 6) & 0x1F) | 0xC0);
      bytes.push((c & 0x3F) | 0x80);
    } else {
      bytes.push(c & 0xFF);
    }
  }
  return bytes;
}


const byteToString = arr => {
  if (typeof arr === 'string') {
    return arr;
  }
  var str = '',
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}

const _chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

/**
 * 生成随机数数字+大写字母，输入长度n
 */
const randomStr = n => {
  let res = '';
  for (let i = 0; i < n; i++) {
    const id = Math.ceil(Math.random() * 35);
    res += _chars[id];
  }
  return res;
}


module.exports = {
  formatDateTime,
  formatTime,
  formatNumber,
  uuid,
  findIndexById,
  getDate,
  getTime,
  setDate,
  setTime,
  stringToByte,
  byteToString,
  randomStr
}
