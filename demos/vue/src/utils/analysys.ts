import AnalysysAgent from 'ans-javascript-sdk/sdk/AnalysysAgent_JS_SDK.es6.min.js'


AnalysysAgent.init({
	appkey: '47fce41a0472c616',//APPKEY
	uploadURL: 'https://uba-up.analysysdata.com',//上传数据的地址
	debugMode: "2",
	auto: true, // 设置自动采集页面打开事件
	autoTrack: false, // 设置是否启用全埋点功能
	autoHeatmap: false,
	autoWebstay: false // 在开启热图功能(autoHeatmap设置为true)后，设置是否追踪页面滚动行为，即在产品当中可分析页面浏览深度
})

function analysyPageView(info: PageAnalyType) {
	AnalysysAgent.pageView('pageloadComplete', info)
}

interface ObjType {
	[key: string]: any
}


const tMap = new Map();
/* 
 用户点击事件
 event: 事件id DCS_系统名_事件名
 info: 事件信息
 */
function track(event: string, info: ObjType, once = false) {
	try {
		// 其他子基座 传递过来的带有 DCS_
		if (!event.startsWith('DCS_')) {
			event = `DCS_portal_${event}`
		}
		if (once) {
			const key = AnalysysAgent.getDistinctId() + event
			if (!tMap.get(key)) {
				Promise.resolve().then(() => {
					AnalysysAgent.track(event, info)
				})
				tMap.set(key, 1)
			}
		} else {
			Promise.resolve().then(() => {
				AnalysysAgent.track(event, info)
			})
		}
	} catch (err) {
		console.log('埋点Fail:', err)
	}
}

type UserType = {
	userID?: string; // 用户ID
	userName_ppl?: string; // 用户姓名
	userIdentity_ppl?: string; // 用户身份信息
	userDepartment_ppl?: string[]; // 用户所属组织 例如["互联*部建设与平台处","中国电科院互联网部","国家电网/中国电力科学研究院有限公司/中国电科院互联网部/互联网部建设与平台处/"]
	userProject?: string // 所属项目
}
// 用户注册关联
function userAssociate(info: UserType) {
	try {
		Promise.resolve().then(() => {
			if (info.userID) {
				AnalysysAgent.alias(info.userID)
			}
			type u = keyof UserType;
			for (let k in info) {
				if (k != 'userID') {
					AnalysysAgent.profileSet(k, info[k as u])
				}
			}
		})
	} catch (e) {
		console.log('埋点Fail:', e)
	}
}

export enum LoadResult {
	success = '加载成功_未失败',
	fail = '加载失败_无法获取'
}
interface PageAnalyType {
	'pageloadResult_var'?: string, //页面加载结果
	'pageloadTime_var'?: number, // 页面加载的总时长，单位秒 页面加载时长 = 基座加载时长 + 子应用加载时长"
	'foundationPageloadTime_var': number, // 基座加载时长 有子应用表示路由开始前置的时间，没有子应用网络请求加载完时间
	'subApplication_var': number, // 子应用加载时长
	'pageName_var': string, // 用户加载页面的名称 DSC_系统名_页面名
	'pageRouteName': string, // 页面路由 DSC_系统名_路由
	'failReason_var'?: string, // "页面加载失败的原因若加载成功则上报文本：""未失败""；若无法获取则上报文本：""无法获取"""
}

const pageMap = new Map()
function pageLoadStart(pageRouteName: string) {
	pageMap.set(pageRouteName, new Date().valueOf())
}

function pageLoadEnd(info: any, pageType = 1) {
	try {
		const lresult = (info['loadResult'] || LoadResult.success).split('_')
		const page_name = info['pageName_var'] || ''
		const page_route_name = info['pageRouteName'] || ''

		let child_time = 0
		let parent_time = 0

		if (pageType == 1) {
			child_time = info['subApplication_var'] || 0
			parent_time = (info['foundationPageloadTime_var'] == undefined ? new Date().valueOf() : info['foundationPageloadTime_var']) - (pageMap.get(page_route_name) || 0)
		}
		if (pageType == 2) {
			child_time = (info['subApplication_var'] == undefined ? new Date().valueOf() : info['subApplication_var']) - (pageMap.get(page_route_name) || 0)
			parent_time = info['foundationPageloadTime_var'] || 0
		}

		if (pageType == 3) {
			const p_t = info['foundationPageloadTime_var'] == undefined ? new Date().valueOf() : info['foundationPageloadTime_var']
			const c_t = info['subApplication_var'] == undefined ? new Date().valueOf() : info['subApplication_var']
			child_time = c_t - p_t

			// pageMap key 以page_route_name开头
			let e_time = 0
			for (const [key, value] of pageMap) {
				if (key.includes(page_route_name)) {
					e_time = value
					break
				}
			}
			if (e_time) {
				parent_time = p_t - e_time
			} else {
				parent_time = 12
			}
		}

		const pl_info = {
			// 'pageloadResult_var': info['pageloadResult_var'] || '加载成功',
			'pageloadTime_var': parent_time + child_time,
			'foundationPageloadTime_var': parent_time,
			'subApplication_var': child_time,
			'pageName_var': page_name,
			'pageRouteName': page_route_name,
			'failReason_var': info['failReason_var'] || '未失败',
		}
		pageMap.clear()
		Promise.resolve().then(() => {
			analysyPageView(pl_info)
		})
	} catch (e) {
		console.log('埋点Fail:', e)
	}
}

/*
页面加载3种
主基座 有时间, 子基座  0, 1 
主基座 0, 子基座  有时间 2
主基座 有时间, 子基座  有时间, 3
*/
function pageChildLoadEnd(info: any) {
	pageLoadEnd(info, 2)
}

export let childMountedTime = {
	time: 0
}
function pageChildDefaultLoadEnd(info: any) {
	info.foundationPageloadTime_var = childMountedTime.time
	pageLoadEnd(info, 3)
}

/*
	页面开始加载
	pageLoadStart("xxx") // DSC_系统名_路由
	
	页面加载成功，
	pageLoadEnd({
		'pageName_var': route.name,  // DSC_系统名_页面名
		'pageRouteName': // DSC_系统名_路由
	})
	pageChildLoadEnd({
		'pageName_var': route.name,  // DSC_系统名_页面名
		'pageRouteName': // DSC_系统名_路由
	})
	
	pageChildDefaultLoadEnd({
		'pageName_var': route.name,  // DSC_系统名_页面名
		'pageRouteName': 'DSC_port' + window.__MICRO_APP_BASE_ROUTE__,// DSC_系统名_路由
		'subApplication_var': 000 // 子基座 默认路由加载结束时间
	})
	const ana = window.microApp.getData().analysePage
	ana.userAssociate({
		userProject: '工单'
	})
	ana.pageChildDefaultLoadEnd({
		'pageName_var': 'DSC_worksheet_待办事项',  // DSC_系统名_页面名
		'pageRouteName': `DSC_port_${window.__MICRO_APP_BASE_ROUTE__}`,// DSC_系统名_路由
		'subApplication_var': new Date().valueOf()  // 子基座 默认路由加载结束时间
	})
	
	页面加载失败
	router.afterEach((to, from, failure) => {
		if (!to.name) {
			pageLoadEnd({
				'pageName_var': to.path, 
				'pageRouteName': `DSC_port_${to.path}`
				'pageloadResult_var': '加载失败',
				'failReason_var': '无法获取'
			})
		}
	})
	
	点击事件
	Analyse.track('digitalServiceApplyNow', {
		'digitalServiceType_var': '应用系统支撑服务',
		'digitalServiceName_var': '权限开通调整',
		'entrenceName_var': '工单申请入口'
	})
*/
export default {
	userAssociate,
	track,
	pageLoadStart,
	pageLoadEnd,
	childMountedTime,
	pageChildLoadEnd,
	pageChildDefaultLoadEnd,
	AnalysysAgent
}