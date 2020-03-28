var endings = ['/', ':', '?', '#']
var starters = ['/', '@']

function getDomainFromUrl (url) {
  if (typeof url !== 'string') {
    return ''
  }

  let domainInc = 0
  let offsetDomain = 0
  let offsetStartSlice = 0
  let offsetPath = 0
  let len = url.length
  let i = 0

  // Find end offset of domain
  while (len-- && ++i) {
    if (domainInc && endings.indexOf(url[i]) > -1) {
      break
    }

    if (url[i] !== '.') {
      continue
    }

    ++domainInc

    offsetDomain = i
  }

  offsetPath = i

  i = offsetDomain

  // Find offset before domain name.
  while (i--) {
    // Look for sub domain, protocol or basic auth
    if (starters.indexOf(url[i]) === -1) {
      continue
    }

    offsetStartSlice = i + 1

    break
  }

  // offsetStartSlice should always be larger than protocol
  if (url.indexOf('//localhost') > -1) {
    return 'localhost'
  }

  if (offsetStartSlice < 6) {
    return ''
  }

  // Tried several approaches slicing a string. Can't get it any faster than this.
  return url.slice(offsetStartSlice, offsetPath)
}
function extractDomain (urls) {
  if (typeof urls === 'string') {
    return getDomainFromUrl(urls)
  } else if (Array.isArray(urls)) {
    var extractedUrls = []

    for (var i = 0; i < urls.length; i++) {
      extractedUrls.push(getDomainFromUrl(urls[i]))
    }

    return extractedUrls
  } else {
    return ''
  }
}

export default extractDomain
