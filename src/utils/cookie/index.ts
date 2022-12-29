

const document = window.document

/**
 * Cookie setter & setter
 *
 * @param {String} name The identify name of cookie.
 * @param {String} value (Optional) String to set cookie value. (`null` to remove cookie)
 * @param {Object} options (Optional) Set the cooke native options, (path domain, secure, expires)
 */
export default function (name: string, value?: string, options?) {
  options = options || {}
  if (value !== undefined) { // set cookie
    if (value === null) {
      value = ''
      options.expires = -1
    }
    if (typeof options.expires === 'number') {
      const days = options.expires, t = options.expires = new Date()
      t.setTime(t.getTime() + days * 864e+5) // 24 * 60 * 60 * 1000
    }
    const encode = function (s) {
      try {
        return options.raw ? s : encodeURIComponent(s)
      } catch (e) {
      }
      return s
    }
    return (document.cookie = [
      encode(name), '=', encode(value),
      options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
      options.path ? '; path=' + options.path : '',
      options.domain ? '; domain=' + options.domain : '',
      options.secure ? '; secure' : ''
    ].join(''))
  } else {
    let value = null,
      cookie = document.cookie,
      decode = function (s) {
        return options.raw ? s : decodeURIComponent(s)
      },
      cookies = cookie ? cookie.split('; ') : []
    for (let i = -1, l = cookies.length, c = name.length + 1; ++i < l;) {
      cookie = cookies[i].trim()
      if (cookie.substring(0, c) === (name + '=')) {
        value = decode(cookie.substring(c))
        break
      }
    }
    return value
  }
}
