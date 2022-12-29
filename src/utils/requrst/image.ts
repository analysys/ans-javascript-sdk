
import { jsonToString } from '../type/transform'
import { requestOptions } from '../../types/index'
import { encode } from '../../utils/base64'
import md5 from '../../utils/md5'
import { config } from '../../store/config'

export default function (options: requestOptions, successFn?: Function, errorFn?: Function) {

  let img = new Image(1, 1), sendTime = null

  img.crossOrigin = 'anonymous'

  // 清空
  function empty () {
    img.src = ''
    img.onload = null
    img.onerror = null
    img.onabort = null
  }

  function success() {
    clearTimeout(sendTime)
    successFn && successFn({
      header: {},
      data: {code: 200}
    })
    empty()
  }

  img.onload = function() {
    success()
  }

  img.onerror = function (e, v) {
    success()
  }

  // 超时后
  img.onabort = function () {
    empty()
    errorFn && errorFn()
  }
  
  let url = options.url
  if (options.data) {
    const data = encode(options.data)
    const newData = setValidKey(data, url)
    url += `&data=${encodeURIComponent(newData.data)}&send_type=${encodeURIComponent(newData.send_type)}`
  }

  // 超时后自动取消
  sendTime = setTimeout(() => {
    img.onabort()
  }, config.sendDataTimeout)

  img.src = url
}


function setValidKey (optionData, url) {
  const data = {
    data: optionData,
    send_type: ''
  }
  const param = []
  for (const key in data) {
    param.push(key + '=' + encodeURIComponent(data[key]))
  }
  let validurl = url + '&' + param.join('&')

  validurl = validurl.replace(config.uploadURL, '')
  
  const validValue = md5(validurl, 32).split('')
  const validkey = validValue[2] + '' + validValue[0] + '' + validValue[4]
  data.send_type = validkey
  return data
}