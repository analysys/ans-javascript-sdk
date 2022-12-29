
import { requestOptions } from '../../types/index'

export default function(options: requestOptions) {
  const url = options.url
  const data = JSON.stringify(options.data)
  navigator.sendBeacon(url, data)
}