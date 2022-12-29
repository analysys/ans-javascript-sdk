
import { requestOptions } from '../../types/index'
import { jsonToString, headersToJson } from '../type/transform'
import { assign } from '../../utils/object'

export default function(options: requestOptions, successFn?: Function, errorFn?: Function) {

  const xhr = new window.XMLHttpRequest() || new window.ActiveXObject('Microsoft.XMLHTTP') || new window.ActiveXObject('Msxml2.XMLHTTP')

  const method = (options.method || 'GET').toUpperCase();
  let url = options.url;
  let data = options.data;
  const header = assign({}, options.header)

  if (method === 'GET' && options.data) {
    const link = /\?/.test(options.url) ? '&' : '?'
    url += link + jsonToString(options.data)
  }

  if (method === 'POST' && options.data && !header['Content-Type']) {
    data = JSON.stringify(options.data)
  }

  // 建立连接
  xhr.open(method, url);

  // 设置请求头
  for (const key in header) {
    xhr.setRequestHeader(key, header[key])
  }

  xhr.timeout = options.timeout;

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const res = {
          header: headersToJson(xhr.getAllResponseHeaders()),
          data: xhr.responseText
        }
        try {
          res.data = JSON.parse(xhr.responseText)
        } catch(err) {
        }
        successFn && successFn(res, xhr)
        options.success && options.success(res, xhr)
      } else {
        errorFn && errorFn(xhr)
        options.error && options.error(xhr)
      }
    }
  }
  
  // 发送数据
  xhr.send(data);
}