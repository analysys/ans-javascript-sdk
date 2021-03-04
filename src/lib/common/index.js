var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

function _utf8Encode (string) {
  string = string.replace(/\r\n/g, '\n')
  var utftext = ''
  for (var n = 0; n < string.length; n++) {
    var c = string.charCodeAt(n)
    if (c < 128) {
      utftext += String.fromCharCode(c)
    } else if ((c > 127) && (c < 2048)) {
      utftext += String.fromCharCode((c >> 6) | 192)
      utftext += String.fromCharCode((c & 63) | 128)
    } else {
      utftext += String.fromCharCode((c >> 12) | 224)
      utftext += String.fromCharCode(((c >> 6) & 63) | 128)
      utftext += String.fromCharCode((c & 63) | 128)
    }
  }
  return utftext
}

function _utf8Decode (utftext) {
  var string = ''
  var i = 0
  var c = 0
  var c2 = 0
  var c3 = 0
  while (i < utftext.length) {
    c = utftext.charCodeAt(i)
    if (c < 128) {
      string += String.fromCharCode(c)
      i++
    } else if ((c > 191) && (c < 224)) {
      c2 = utftext.charCodeAt(i + 1)
      string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
      i += 2
    } else {
      c2 = utftext.charCodeAt(i + 1)
      c3 = utftext.charCodeAt(i + 2)
      string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
      i += 3
    }
  }
  return string
}

function Util () { }
Util.prototype.paramType = function (param) {
  return Object.prototype.toString.call(param).replace('[object ', '').replace(']', '')
}
Util.prototype.objHasKay = function (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
Util.prototype.ArrayToObj = function (arr) {
  var obj = {}
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i]] = ''
  }
  return obj
}
Util.prototype.keyValueToObje = function (key, value) {
  var obj = {}
  obj[key] = value
  return obj
}
Util.prototype.toDeep = function (param) {
  var paramNew = null
  if (this.paramType(param) === 'Array') {
    paramNew = []
    for (var i = 0; i < param.length; i++) {
      paramNew.push(this.toDeep(param[i]))
    }
  } else if (this.paramType(param) === 'Object') {
    paramNew = {}
    for (var key in param) {
      paramNew[key] = this.toDeep(param[key])
    }
  } else {
    paramNew = param
  }
  return paramNew
}

Util.prototype.toDeepObj = function (param1, param2) {
  var obj = {}

  if (this.paramType(param1) === 'String') {
    obj = this.keyValueToObje(param1, param2)
    return obj
  }

  if (this.paramType(param1) === 'Array') {
    obj = this.ArrayToObj(param1)
    return obj
  }

  if (this.paramType(param1) === 'Object') {
    for (var key in param1) {
      obj[key] = this.toDeepObj(param1[key])
    }
  }
  return obj
}
Util.prototype.toDeep = function (param) {
  var paramNew = null
  if (this.paramType(param) === 'Array') {
    paramNew = []
    for (var i = 0; i < param.length; i++) {
      paramNew.push(this.toDeep(param[i]))
    }
  } else if (this.paramType(param) === 'Object') {
    paramNew = {}
    for (var key in param) {
      paramNew[key] = this.toDeep(param[key])
    }
  } else {
    paramNew = param
  }
  return paramNew
}
Util.prototype.toObj = function (param1, param2) {
  var obj = {}

  if (this.paramType(param1) === 'String') {
    obj = this.keyValueToObje(param1, param2)
    return obj
  }

  if (this.paramType(param1) === 'Array') {
    obj = this.ArrayToObj(param1)
    return obj
  }

  if (this.paramType(param1) === 'Object') {
    return param1
  }
  return obj
}
Util.prototype.objMerge = function (parentObj, part) {
  if (this.paramType(parentObj) !== 'Object' || this.paramType(part) !== 'Object') {
    return parentObj
  }
  var obj = {}
  for (var key in parentObj) {
    obj[key] = parentObj[key]
  }
  for (var partKey in part) {
    var partValue = part[partKey]
    var objValue = obj[partKey]
    var partValueType = this.paramType(partValue)
    var objValueType = this.paramType(objValue)
    if (objValue && objValueType === 'Object' && partValueType === 'Object') {
      obj[partKey] = this.objMerge(objValue, partValue)
    }
    else if (objValueType === 'Array' && partValueType === 'Array') {
      obj[partKey] = this.arrayMergeUnique(objValue, partValue)
    }
    else if (partValueType === 'Function' && objValueType === 'Function') {
      obj[partKey] = this.compose(objValue, partValue)
    } else {
      obj[partKey] = partValue
    }
  }
  return obj
}
Util.prototype.compose = function () {
  var args = arguments
  var start = args.length - 1
  return function () {
    var i = start
    var result = args[start].apply(this, arguments)
    while (i--) result = args[i].call(this, result)
    return result
  }
}
Util.prototype.fnMerge = function (parentObj, part) {
  return this.objMerge(parentObj, part)
}
Util.prototype.arrayUnique = function (arr) {
  var tmpArr = []
  var hash = {} // hash为hash表
  for (var i = 0; i < arr.length; i++) {
    if (!hash[arr[i]]) { // 如果hash表中没有当前项
      hash[arr[i]] = true // 存入hash表
      tmpArr.push(arr[i]) // 存入临时数组
    }
  }
  return tmpArr
}
Util.prototype.arrayMerge = function (arr1, arr2) {
  var a1 = []
  for (var i = 0; i < arr1.length; i++) {
    var a1i = arr1[i]
    if (this.paramType(arr1[i]) === 'Object') {
      a1i = this.toDeep(arr1[i])//JSON.parse(JSON.stringify(arr1[i]))
    }
    a1.push(a1i)
  }
  for (var y = 0; y < arr2.length; y++) {
    var a2i = arr2[y]
    if (this.paramType(arr2[y]) === 'Object') {
      a2i = this.toDeep(arr2[y])//JSON.parse(JSON.stringify(arr2[y]))
    }
    a1.push(a2i)
  }
  return a1
}
Util.prototype.arrayMergeUnique = function (arr1, arr2) {
  arr1.push.apply(arr1, arr2)
  return this.arrayUnique(arr1)
}
Util.prototype.encode = function (input) {
  var output = ''
  var chr1
  var chr2
  var chr3
  var enc1
  var enc2
  var enc3
  var enc4
  var i = 0
  input = _utf8Encode(input)
  while (i < input.length) {
    chr1 = input.charCodeAt(i++)
    chr2 = input.charCodeAt(i++)
    chr3 = input.charCodeAt(i++)
    enc1 = chr1 >> 2
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    enc4 = chr3 & 63
    if (isNaN(chr2)) {
      enc3 = enc4 = 64
    } else if (isNaN(chr3)) {
      enc4 = 64
    }
    output = output +
      _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
      _keyStr.charAt(enc3) + _keyStr.charAt(enc4)
  }
  return output
}
Util.prototype.decode = function (input) {
  var output = ''
  var chr1
  var chr2
  var chr3
  var enc1
  var enc2
  var enc3
  var enc4
  var i = 0
  input = input.replace(/[^A-Za-z0-9+/=]/g, '')
  while (i < input.length) {
    enc1 = _keyStr.indexOf(input.charAt(i++))
    enc2 = _keyStr.indexOf(input.charAt(i++))
    enc3 = _keyStr.indexOf(input.charAt(i++))
    enc4 = _keyStr.indexOf(input.charAt(i++))
    chr1 = (enc1 << 2) | (enc2 >> 4)
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
    chr3 = ((enc3 & 3) << 6) | enc4
    output = output + String.fromCharCode(chr1)
    if (enc3 !== 64) {
      output = output + String.fromCharCode(chr2)
    }
    if (enc4 !== 64) {
      output = output + String.fromCharCode(chr3)
    }
  }
  output = _utf8Decode(output)
  return output
}
Util.prototype.isEmptyObject = function (obj) {
  for (var name in obj) {
    return false
  }
  return true
}
Util.prototype.format = function (time, format) {
  var offsetGMT = time.getTimezoneOffset()
  time = new Date(time.getTime() + offsetGMT * 60 * 1000 + 8 * 60 * 60 * 1000) // 转换为东八区时间
  var o = {
    'M+': time.getMonth() + 1, // month
    'd+': time.getDate(), // day
    'h+': time.getHours(), // hour
    'm+': time.getMinutes(), // minute
    's+': time.getSeconds(), // second
    'q+': Math.floor((time.getMonth() + 3) / 3), // quarter
    'S+': time.getMilliseconds() // millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1,
      (time.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1,
        RegExp.$1.length === 3 ? (('' + o[k]).length < 3 ? ('00' + o[k]).substr(('00' + o[k]).length - 3, ('00' + o[k]).length) : o[k])
          : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }

  return format.toString()
}
Util.prototype.MD5 = function (value, bit) {
  var sMessage = value

  function RotateLeft (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
  }

  function AddUnsigned (lX, lY) {
    var lX4, lY4, lX8, lY8, lResult
    lX8 = (lX & 0x80000000)
    lY8 = (lY & 0x80000000)
    lX4 = (lX & 0x40000000)
    lY4 = (lY & 0x40000000)
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
    if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
      else return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
    } else return (lResult ^ lX8 ^ lY8)
  }

  function F (x, y, z) {
    return (x & y) | ((~x) & z)
  }

  function G (x, y, z) {
    return (x & z) | (y & (~z))
  }

  function H (x, y, z) {
    return (x ^ y ^ z)
  }

  function I (x, y, z) {
    return (y ^ (x | (~z)))
  }

  function FF (a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac))
    return AddUnsigned(RotateLeft(a, s), b)
  }

  function GG (a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac))
    return AddUnsigned(RotateLeft(a, s), b)
  }

  function HH (a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac))
    return AddUnsigned(RotateLeft(a, s), b)
  }

  function II (a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac))
    return AddUnsigned(RotateLeft(a, s), b)
  }

  function ConvertToWordArray (sMessage) {
    var lWordCount
    var lMessageLength = sMessage.length
    var lNumberOfWordsTemp1 = lMessageLength + 8
    var lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64
    var lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16
    var lWordArray = Array(lNumberOfWords - 1)
    var lBytePosition = 0
    var lByteCount = 0
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4
      lBytePosition = (lByteCount % 4) * 8
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (sMessage.charCodeAt(lByteCount) << lBytePosition))
      lByteCount++
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4
    lBytePosition = (lByteCount % 4) * 8
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
    return lWordArray
  }

  function WordToHex (lValue) {
    var WordToHexValue = ''
    var WordToHexValueTemp = ''
    var lByte
    var lCount
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255
      WordToHexValueTemp = '0' + lByte.toString(16)
      WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2)
    }
    return WordToHexValue
  }
  var x = []
  var k, AA, BB, CC, DD, a, b, c, d
  var S11 = 7
  var S12 = 12
  var S13 = 17
  var S14 = 22
  var S21 = 5
  var S22 = 9
  var S23 = 14
  var S24 = 20
  var S31 = 4
  var S32 = 11
  var S33 = 16
  var S34 = 23
  var S41 = 6
  var S42 = 10
  var S43 = 15
  var S44 = 21
  // Steps 1 and 2. Append padding bits and length and convert to words
  x = ConvertToWordArray(sMessage)
  // Step 3. Initialise
  a = 0x67452301
  b = 0xEFCDAB89
  c = 0x98BADCFE
  d = 0x10325476
  // Step 4. Process the message in 16-word blocks
  for (k = 0; k < x.length; k += 16) {
    AA = a
    BB = b
    CC = c
    DD = d
    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
    d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
    b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
    c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
    b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
    d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
    c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
    b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
    d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
    c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
    b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821)
    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
    d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
    c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
    b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453)
    c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
    b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
    d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
    c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
    b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
    d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
    c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
    b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
    c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
    b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
    d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
    c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
    b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
    d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
    c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
    d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
    c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
    b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244)
    d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
    c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
    b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
    d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
    c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
    b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
    d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
    c = II(c, d, a, b, x[k + 6], S43, 0xA3014314)
    b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
    d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
    c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
    b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391)
    a = AddUnsigned(a, AA)
    b = AddUnsigned(b, BB)
    c = AddUnsigned(c, CC)
    d = AddUnsigned(d, DD)
  }
  if (bit === 32) {
    return WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d)
  } else {
    return WordToHex(b) + WordToHex(c)
  }
}
Util.prototype.clientTimeZone = function () {
  var munites = new Date().getTimezoneOffset()

  var hour = parseInt(munites / 60)

  var munite = munites % 60

  var prefix = '-'

  if (hour <= 0 || munite < 0) {
    prefix = '+'

    hour = -hour

    if (munite < 0) {
      munite = -munite
    }
  }

  hour = hour + ''

  munite = munite + ''

  if (hour.length === 1) {
    hour = '0' + hour
  }

  if (munite.length === 1) {
    munite = '0' + munite
  }

  return prefix + hour + ':' + munite
}

Util.prototype.delEmpty = function (obj) {
  var newObj = {}
  for (var key in obj) {
    var inType = true
    var valueType = this.paramType(obj[key])

    if (valueType !== 'Object') {
      if (!obj[key] &&
        (valueType !== 'Number' || isNaN(obj[key])) &&
        valueType !== 'Boolean') {
        inType = false
      }
      if (inType === true) {
        newObj[key] = obj[key]
      }
    } else {
      newObj[key] = this.delEmpty(obj[key])
    }
  }
  for (var newObjKey in newObj) {
    var values = []
    for (var key1 in newObj[newObjKey]) {
      values.push(newObj[newObjKey][key1])
    }
    if (values.length === 0 && newObj[newObjKey].constructor === Object) {
      delete newObj[newObjKey]
    }
  }
  return newObj
}

Util.prototype.addEvent = function (el, type, fn, useCapture) {
  if (document.addEventListener) {
    if ((this.paramType(el) === 'Array' || this.paramType(el) === 'HTMLCollection') && el.length && el !== window) {
      for (var i = 0; i < el.length; i++) {
        this.addEvent(el[i], type, fn, useCapture)
      }
    } else {
      el.addEventListener(type, fn, useCapture)
    }
  } else {
    if (el.length && el !== window) {
      for (var index = 0; index < el.length; index++) {
        this.addEvent(el[index], type, fn)
      }
    } else {
      el.attachEvent('on' + type, function () {
        return fn.call(el, window.event)
      })
    }
  }
}

Util.prototype.removeEvent = function (el, type, fn, useCapture) {
  if (document.removeEventListener) {
    if (el.length) {
      for (var i = 0; i < el.length; i++) {
        this.removeEvent(el[i], type, fn, useCapture)
      }
    } else {
      el.removeEventListener(type, fn, useCapture)
    }
  } else {
    if (el.length) {
      for (var index = 0; index < el.length; index++) {
        this.removeEvent(el[index], type, fn)
      }
    } else {
      el.detachEvent('on' + type, function () {
        return fn.call(el, window.event)
      })
    }
  }
}


Util.prototype.addEleLable = function (eleName, className, id, parent) {
  var dom = document
  var createEle = dom.createElement(eleName)
  var domBody = parent || dom.body || dom.getElementsByTagName('body')[0]
  if (id) {
    createEle.id = id
  }
  if (className) {
    createEle.className = className
  }
  domBody.appendChild(createEle)
  return createEle
}
Util.prototype.addScript = function (fileName, urlPath, callback) {
  var dom = document
  var createScript = dom.createElement('script')
  var domHead = dom.getElementsByTagName('script')
  createScript.type = 'text/javascript'
  createScript.async = true
  createScript.id = fileName
  var sdkUrl = ''

  if (!urlPath) {
    if (dom.getElementById('ARK_SDK')) {
      sdkUrl = dom.getElementById('ARK_SDK').src
    } else {
      for (var i = 0; i < domHead.length; i++) {
        if (domHead[i].src && domHead[i].src.indexOf('AnalysysAgent_JS_SDK') > -1) {
          sdkUrl = domHead[i].src
          break
        }
      }
    }
  } else {
    if (this.paramType(urlPath) === 'Array') {
      var commonFn = urlPath[0]
      var path = urlPath[1]
      commonFn([path], callback)
      return
    }
    sdkUrl = urlPath.charAt(urlPath.length - 1) === '/' ? urlPath : urlPath + '/'
  }

  var sdkPath = sdkUrl.substring(0, sdkUrl.lastIndexOf('/') + 1)
  createScript.src = sdkPath + fileName + '.min.js?v=' + this.format(new Date(), 'yyyyMMddhhmm') // 方舟B SDK地址
  createScript.onload = setTimeout(callback, 500)
  domHead[0].parentNode.insertBefore(createScript, domHead[0])
}

function CheckChinese (val) {
  var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
  if (reg.test(val)) {
    return true
  }
  return false
}

Util.prototype.GetUrlParam = function (paraName) {
  var url = document.location.toString()
  var wName = window.name
  if (this.paramType(wName) === 'String' && wName.indexOf(paraName) > -1) {
    url = wName
  }
  var arrObj = url.split('?')
  if (arrObj.length > 1) {
    var arrPara = [] // arrObj[1].split("&")
    for (var i = 1; i < arrObj.length; i++) {
      arrPara.push.apply(arrPara, arrObj[i].split('&'))
    }
    var arr
    for (var index = 0; index < arrPara.length; index++) {
      arr = arrPara[index].split('=')

      if (arr != null && arr[0] === paraName) {
        var value = arr[1]
        if (arr[1].indexOf('#') > -1) {
          value = value.split('#')[0]
        }
        if (value.indexOf('%') > -1) {
          try {
            var utfValue = decodeURI(value)
            if (CheckChinese(utfValue)) {
              return utfValue
            }
          } catch (e) { }
          if (this.paramType(window.AnalysysModule) === 'Object' && this.paramType(window.AnalysysModule.decodeGBK) === 'Function') {
            try {
              var gbkValue = window.AnalysysModule.decodeGBK(value, 'gbk')
              return gbkValue
            } catch (e) { }
          }
        }
        return value
      }
    }
    return ''
  } else {
    return ''
  }
}

Util.prototype.stringSlice = function (str, length) {
  return str.slice(0, length)
}
Util.prototype.trim = function (str) {
  if (this.paramType(str) === 'String') {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  } else {
    return str
  }
}
Util.prototype.changeHash = function (callback) {
  var historyPushState = window.history.pushState
  var historyReplaceState = window.history.replaceState
  window.history.pushState = function () {
    historyPushState.apply(window.history, arguments)
    callback.apply(callback)
  }
  window.history.replaceState = function () {
    historyReplaceState.apply(window.history, arguments)
    callback.apply(callback)
  }
  var state = historyPushState ? 'popstate' : 'hashchange'
  state = (!!window.ActiveXObject || 'ActiveXObject' in window) ? 'hashchange' : 'popstate'
  if (('on' + state) in window) {
    this.addEvent(window, state, function () {
      setTimeout(callback, 0)
    })
  }
}

Util.prototype.deviceType = function () {
  var u = navigator.userAgent

  if ((u.indexOf('Tablet') > -1 && u.indexOf('PC') < 0) || u.indexOf('Pad') > -1 || u.indexOf('Nexus 7') > -1) {
    return 'tablet'
  }
  if (u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1) {
    return 'phone'
  }
  return 'desktop'
}
Util.prototype.checkTypeList = function (list, ele) {
  var listType = this.paramType(list)
  if (listType === 'String') {
    var url = window.location.href
    var urlHost = window.location.protocol + '//' + window.location.host
    var urlPath = urlHost + window.location.pathname
    var urlIndex = urlPath + 'index.html'
    var urlHash = urlPath + window.location.hash
    var urlArray = [url, urlHost, urlIndex, urlPath, urlHash]
    if (urlArray.indexOf(list) > -1) {
      return true
    }
  } else if (listType === 'Function') {
    return list.call(list, ele)
  } else if (listType === 'Array') {
    for (var i = 0; i < list.length; i++) {
      if (this.checkTypeList(list[i], ele) === true) {
        return true
      }
    }
  }
  return false
}
/**
 * document.querySelectorAll 兼容方法
 * @param {Sting} selectors 选择器 不包含伪类
 * @returns {Array} elements 符合条件的元素列表
 */

Util.prototype.selectorAllEleList = function (selectors) {
  var eleList = []
  var eleTagName = selectors.split('.')[0]
  if (this.paramType(document.querySelectorAll) === 'Function' && selectors.indexOf('|') < 0) {
    try {
      return document.querySelectorAll(selectors)
    } catch (e) {
    }
  }
  var eleId = ''
  if (selectors.indexOf('#') > -1) {
    eleId = selectors.split('.')[0].split('#')[1]
    var ele = document.getElementById(eleId)
    if (ele) {
      eleList.push(ele)
    }
  } else if (selectors.indexOf('.') < 0) {
    return document.getElementsByTagName(eleTagName)
  } else if (selectors.indexOf('[') > -1 && selectors.indexOf(']') > -1) {
    var nodeList = document.getElementsByTagName('*')
    var selector = selectors.replace('[', '').replace(']', '')
    for (var y = 0; y < nodeList.length; y++) {
      var attr = nodeList[y].getAttribute(selector)
      if (this.paramType(attr) === 'String') {
        eleList.push(ele)
      }
    }
  } else {
    var domList = document.getElementsByTagName(eleTagName)
    for (var i = 0; i < domList.length; i++) {
      var dom = domList[i]
      var domClassNameList = this.paramType(dom.className) === 'String' ? dom.className.split(' ') : []
      if (domClassNameList.length > 0) {
        if ((eleTagName + '.' + domClassNameList.join('.')).indexOf(selectors) > -1) {
          eleList.push(dom)
        }
      }
    }
  }
  // var anchors = [];
  // for (var z = 0; z < eleList.length; z++) {
  //   anchors.push(eleList[z]);
  // }
  // anchors = anchors.sort(function (x, y) {
  //   return offset(x).left - offset(y).left && offset(x).top - offset(y).top
  // })
  // eleList = anchors
  return eleList
}
// /**
//  * [parserDom description]根据元素及其上层元素获取元素位置及显示/隐藏
//  * @param  {[type]} ele [description] 元素Dom对象
//  * @return {[type]} obj [description] 元素对应位置与显示/隐藏
//  */
// function offset (curEle) {
//   var totalLeft = null, totalTop = null, par = curEle.offsetParent;
//   //首先加自己本身的左偏移和上偏移
//   totalLeft += curEle.offsetLeft;
//   totalTop += curEle.offsetTop
//   //只要没有找到body，我们就把父级参照物的边框和偏移也进行累加
//   while (par) {
//     if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
//       //累加父级参照物的边框
//       totalLeft += par.clientLeft;
//       totalTop += par.clientTop
//     }

//     //累加父级参照物本身的偏移
//     totalLeft += par.offsetLeft;
//     totalTop += par.offsetTop
//     par = par.offsetParent;
//   }

//   return {
//     left: totalLeft,
//     top: totalTop
//   }
// }
Util.prototype.getDomainFromUrl = function (domianStatus, host) {
  if (host === '') {
    return ''
  }
  host = host || window.location.hostname



  // var regex = /^*\.*/
  // var match = host.match(regex)
  var urlArr = host.split("/");
  if (urlArr.length > 2) {
    host = urlArr[2]
  }
  var ip = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
  if (ip.test(host) === true || host === 'localhost') return ''
  var strAry = host.split('.')
  var level = domianStatus === true ? 2 : strAry.length
  if (this.paramType(level) !== 'Number' || level < 2) {
    level = 2
  }
  var urlDomain = []
  if (strAry.length > 1) {
    if (strAry.length < level) {
      level = strAry.length
    }
    for (var i = strAry.length - 1; i >= 0; i--) {
      if (urlDomain.length === level) {
        break
      }
      urlDomain.push(strAry[i])
    }
    // host = strAry[strAry.length - 2] + "." + strAry[strAry.length - 1];
  } else {
    return ''
  }
  // }
  return urlDomain.reverse().join('.')
}
Util.prototype.isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
Util.prototype.delNotHybrid = function (obj) {
  delete obj.$is_first_day
  delete obj.$session_id
  delete obj.$is_time_calibrated
  delete obj.$startup_time
  return obj
}

Util.prototype.getUrlPath = function () {
  var hash = window.location.hash
  if (hash.indexOf('?') > -1) {
    hash = hash.split('?')[0]
  }

  return window.location.host + window.location.pathname + hash
}

Util.prototype.detectZoom = function () {
  var metaEles = this.selectorAllEleList('meta')
  var ratio = 1
  for (var i = 0; i < metaEles.length; i++) {
    var attr = metaEles[i].getAttribute('content')
    if (attr && attr.indexOf('initial-scale=') > -1) {
      var attrList = attr.split(',')
      for (var y = 0; y < attrList.length; y++) {
        if (attrList[y].indexOf('initial-scale') > -1) {
          ratio = parseFloat(attrList[y].split('=')[1])
        }
      }
    }
  }
  return ratio;
}
export default new Util()
