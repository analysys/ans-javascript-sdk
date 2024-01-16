
/**
 * 路径相关参数信息存储
 */

 interface paramsValue {
  campaign_id?: string;
  utm_campaign_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_term?: string;
  utm_content?: string;
  utm_campaign?: string;
}

export const pathParams : paramsValue = {
  utm_campaign_id: '',
  utm_source: '',
  utm_medium: '',
  utm_term: '',
  utm_content: '',
  utm_campaign: '',
}

export function getPathParams (): object {
  return pathParams
}

export function setPathParams () : any {
  const url = new URL(decodeURI(window.location.href))
  const searchParams = url.searchParams
  pathParams.utm_campaign_id = searchParams.get('campaign_id') || ''
  pathParams.utm_campaign = searchParams.get('utm_campaign') || ''
  pathParams.utm_content = searchParams.get('utm_content') || ''
  pathParams.utm_medium = searchParams.get('utm_medium') || ''
  pathParams.utm_source = searchParams.get('utm_source') || ''
  pathParams.utm_term = searchParams.get('utm_term') || ''
}