import Util from '../common/index.js'
var UTM = {
  utm_campaign_id: Util.GetUrlParam('campaign_id'),
  utm_source: Util.GetUrlParam('utm_source') || Util.GetUrlParam('hmsr'),
  utm_medium: Util.GetUrlParam('utm_medium') || Util.GetUrlParam('hmpl'),
  utm_term: Util.GetUrlParam('utm_term') || Util.GetUrlParam('hmkw'),
  utm_content: Util.GetUrlParam('utm_content') || Util.GetUrlParam('hmci'),
  utm_campaign: Util.GetUrlParam('utm_campaign') || Util.GetUrlParam('hmcu')
}
function clearUTM () {
  UTM = {
    utm_campaign_id: '',
    utm_source: '',
    utm_medium: '',
    utm_term: '',
    utm_content: '',
    utm_campaign: ''
  }
}
export { UTM, clearUTM }
