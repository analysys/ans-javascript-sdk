import { errorMsg } from './errorMsg.js'

function uploadErrorLog(data) {
    errorMsg['msg'] = data
    var AnalysysAgent = window.AnalysysAgent
    return
    if(!AnalysysAgent || !AnalysysAgent.freeApi){
        setTimeout(function(){uploadErrorLog(data)},100)
    }else{
         AnalysysAgent.freeApi('$errorLog')
    }
}	
export { uploadErrorLog }