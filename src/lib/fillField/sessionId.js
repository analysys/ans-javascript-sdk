import Storage from '../storage/index.js'
import Util from '../common/index.js'
import { clearUTM } from './UTM.js'
function SessionId () {
  this.sessionId = Storage.getLocal('SEESIONID') || this.setId()
  this.sessionDate = Storage.getLocal('SEESIONDATE') || 0
}
SessionId.prototype.setId = function () {
  var date = +new Date()
  this.sessionId = Util.MD5('JS' + date.toString() + Math.random() * 10000000)
  this.sessionDate = date
  Storage.setLocal('SEESIONID', this.sessionId)
  Storage.setLocal('SEESIONDATE', this.sessionDate)
  return this.sessionId
}
SessionId.prototype.getId = function () {
  var date = new Date()
  var nowDate = date.getTime()
  var offsetGMT = date.getTimezoneOffset()
  var nowDay = new Date(nowDate + offsetGMT * 60 * 1000 + 8 * 60 * 60 * 1000).getDate()
  this.sessionDate = Storage.getLocal('SEESIONDATE') || 0

  var sessionDay = this.sessionDate === 0 ? 0 : new Date(this.sessionDate + offsetGMT * 60 * 1000 + 8 * 60 * 60 * 1000).getDate()
  if (!this.sessionId || !this.sessionDate || Number(nowDate) - Number(this.sessionDate) > 30 * 60 * 1000 || nowDay !== sessionDay) {
    clearUTM()
    this.setId()
  }
  this.sessionDate = nowDate
  Storage.setLocal('SEESIONDATE', nowDate)
  this.sessionId = Storage.getLocal('SEESIONID') || this.setId()
  return this.sessionId
}

export default new SessionId()
