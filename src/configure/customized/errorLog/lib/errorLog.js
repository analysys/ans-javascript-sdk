import { errorMsg } from './errorMsg.js'

function uploadErrorLog (data) {
  errorMsg.msg = data
  // var AnalysysAgent = window.AnalysysAgent
  // return
  // if (!window.AnalysysAgent || !window.AnalysysAgent.freeApi) {
  //   setTimeout(function () { uploadErrorLog(data) }, 100)
  // } else {
  //   window.AnalysysAgent.freeApi('$errorLog')
  // }
}
export { uploadErrorLog }
