/**
 * 路径相关参数信息存储
 */

 interface paramsValue {
  scene?: number | string;

  campaign_id?: string;
  utm_campaign_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_term?: string;
  utm_content?: string;
  utm_campaign?: string;

  share_id?: any;
  share_level?: any;
  share_path?: any;
}

export const pathParams : paramsValue = {
  scene: null,
  utm_campaign_id: '',
  utm_source: '',
  utm_medium: '',
  utm_term: '',
  utm_content: '',
  utm_campaign: '',

  share_id: '',
  share_level: '',
  share_path: ''
}

export function getPathParams (): object {
  return pathParams
}

export function setPathParams (option: {query: paramsValue, scene: number}) : any {
  
  const query = option.query
  
  if (query) {
    pathParams.utm_campaign_id = option.query.campaign_id;
    pathParams.utm_campaign = query.utm_campaign;
    pathParams.utm_content = query.utm_content;
    pathParams.utm_medium = query.utm_medium;
    pathParams.utm_source = query.utm_source;
    pathParams.utm_term = query.utm_term;
  }

  if (query.share_id && query.share_level && query.share_path) {
    pathParams.share_id = query.share_id;
    pathParams.share_level = query.share_level;
    pathParams.share_path = decodeURIComponent(query.share_path);
  }

  if (option.scene) {
    pathParams.scene = option.scene
  }
}