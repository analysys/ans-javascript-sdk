import './heatmap.css'
import Util from '../../../../../lib/common/index.js'
import { heatmapConfig, showMapConfig } from '../common/config.js'
import {
  isParent,
  getConstantStyle
} from '../common/index.js'
// var activeStatus = 'heatmap'
// if (top == self && Util.GetUrlParam("arkheatmap").indexOf('true') > -1) {
//     var arkcontent = Util.GetUrlParam("arkcontent")
//     if (arkcontent) {
//         if (arkcontent.charAt(arkcontent.length - 1) == "/") {
//             arkcontent = arkcontent.substr(0, arkcontent.length - 1);
//         }
//         if (arkcontent.charAt(arkcontent.length - 1) == "#") {
//             arkcontent = arkcontent.substr(0, arkcontent.length - 1);
//         }
//         var params = unescape(arkcontent)
//         var content = JSON.parse(params)
//         if (content.code === 'ark/depth') {
//             activeStatus = 'depth'
//         }
//         if (content.code === 'ark/element') {
//             activeStatus = 'element'
//         }
//     }
// }
var heapmapTemp = `<div class="ARK_HEATMAP_HEAD_LOGO"></div>
        <ul class="MENU">
            <li>
                <a href="javascript:void(0)" id="ARKSHOWPOINT">
                    <i class="icon point"></i>
                    <span>点击位置热图</span>
                </a>
            </li>
            <li>
                <a href="javascript:void(0)" id="ARKSHOWELE">
                    <i class="icon ele"></i>
                    <span>点击元素热图</span>
                </a>
            </li>
            <li>
                <a href="javascript:void(0)" id="ARKSHOWDEP">
                    <i class="icon dep"></i>
                    <span>浏览深度线</span>
                </a>
            </li>
        </ul>
        <ul class="CONTROL">
            <li id="ARK_CONTENT_ELEMENT" >
                <div class="setting">
                    <i class="icon element"></i>
                    <span>热门元素列表</span>
                </div>
                <div class="settingList" id="ARK_SETTING_CONTENT_ELEMENT_LIST">
                    <div class="ARROWLIST"></div>
                    <div class="ARK_CONTENT_CROWD">
                        <span class="CROWD_ELEMENT_NAME">热门点击元素</span>
                        <table class="CROWD_ELEMENT_TABLE">
                            <thead>
                                <td>元素内容</td>
                                <td>元素类型</td>
                                <td>用户数</td>
                                <td>点击次数</td>
                                <td>点击次数占比</td>
                            </thead>
                            <tbody id="ARK_ELEMENT_MAP">
                            </tbody>
                        </table>
                    
                    </div>
                </div>
            </li>
            <li id="ARK_CONTENT_SETTING">
                <div class="setting">
                    <i class="icon content"></i>
                    <span id="ARK_CONTENT_NAME">过滤条件(0)</span>
                </div>
                <div class="settingList" id="ARK_SETTING_CONTENT_LIST">
                    <div class="ARROWLIST"></div>
                        <div class="ARK_CONTENT_CROWD">
                            <span class="CROWD_NAME">分析用户群</span>
                            <div class="ARKCROWD">
                                <i class="icon_crowd"></i>
                                <span id="ARKCONTENTCROWD">所有用户</span>
                            </div>
                        </div>
                        <div class="ARK_CONTENT_CROWD">
                            <span class="CROWD_NAME"  style="margin-top:9px;">过滤条件</span>
                            <div class="ARK_CONTENT_ITEM">
                                <ul id="ARKCONTENTITEM">
                                    <li>无</li>
                                </ul>
                            </div>
                        </div>
                        
                </div>
            </li>

            <li id="ARK_SETTING">
                <div class="setting" >
                    <i class="icon"></i>
                    <span>显示设置</span>
                    
                </div>
                <div class="settingList" id="ARK_SETTING_LIST">
                    <div class="ARROWLIST"></div>
                    <div class="SETTINGITEM">
                        <span>显示浏览深度线</span>
                        <input type="checkbox" name="ARK_DEELP_SWITCH" id="ARK_DEELP_SWITCH" class="ARK_HEATMAP_SWITCH_CHOOSEBTN">
                        <label for="ARK_DEELP_SWITCH" class="ARK_HEATMAP_SWITCH_CHOOSEBTN_LABEL"></label>
                    </div>
                    <div class="SETTINGITEM" id="SETTINGCOLOR">
                        <span>调整颜色范围</span>
                        <i class="ARK_TIPS" id="ARK_RANGE_TWO_TIPS"></i>
                        <div class="ARKTOOLTIP"  id="ARK_RANGE_TWO_TOOLTIP" style="left:-25px">
                            <div class="ARROW"></div>
                            <div class="WORDS">调整左侧滑杆改变热度最低的点显示颜色，以适应默认颜色在背景色上无法突出标识的情况；调整右侧滑杆增加点击较少的点颜色显示范围，以适应因为部分极值导致正常数据范围无法标识出层级的情况</div>
                        </div>
                        <div class="ARK_RANGE_TWO" id="ARK_RANGE_TWO" style="background:none;filter: none;">
                            <div class="ARK_RANGE_TWO" id="ARK_RANGE_TWO_BG" style="position: absolute;top: 0px;height: 4px;margin:0;"></div>
                            <div class="ARK_RANGE_TWO_BG" id="ARK_RANGE_TWO_BG_LEFT"></div>
                            <div class="ARK_RANGE_TWO_SLIDER" id="ARK_RANGE_TWO_SLIDER_LEFT"></div>
                            <div class="ARK_RANGE_TWO_BG" style="right: 0px; width: 6px;background:#fb0000" id="ARK_RANGE_TWO_BG_RIGHT"></div>
                            <div class="ARK_RANGE_TWO_SLIDER" style="left: 144px;background-color:#fb0000" id="ARK_RANGE_TWO_SLIDER_RIGHT"></div>
                        </div>
                        
                    </div>
                    <div class="SETTINGITEM" style="margin:0" id="SETTINGBG">
                        <span>调整背景透明度</span>
                        <i class="ARK_TIPS" id="ARK_RANGE_TIPS"></i>
                        <div class="ARKTOOLTIP" id="ARK_RANGE_TOOLTIP" style="left: -11px;">
                            <div class="ARROW"></div>
                            <div class="WORDS">可以调整热图背景透明度，以适应默认透明度下部分背景网页可能无法识别的情况</div>
                        </div>
                        <div class="ARK_RANGE_ONE" id="ARK_RANGE_ONE">
                            <div class="ARK_RANGE_ONE_BG" id="ARK_RANGE_ONE_BG" style="right: 0"></div>
                            <div class="ARK_RANGE_ONE_SLIDER"  id="ARK_RANGE_ONE_SLIDER"></div>
                            <div class="ARK_RANGE_ONE_NUM" id="ARK_RANGE_ONE_NUM">65%</div>
                        </div>
                        
                    </div>
                </div>
            </li>
            <li id="ARK_HEATMAP_SWITCH_BOX">
                <input type="checkbox" name="ARK_HEATMAP_SWITCH" id="ARK_HEATMAP_SWITCH" checked="true" class="ARK_HEATMAP_SWITCH_CHOOSEBTN">
                <label for="ARK_HEATMAP_SWITCH" class="ARK_HEATMAP_SWITCH_CHOOSEBTN_LABEL"></label>
                <span class="ARK_HEATMAP_SWITCH_NAME">热图显示</span>
            </li>
            <li>
                <a href="javascript:void(0)" id="ARK_REFRESH">
                    <i class="REFRESH"></i>
                </a>
                <div class="ARKTOOLTIP" style="left:-21px;">
                    <div class="ARROW"></div>
                    <div class="WORDS">刷新</span>
                </div>
            </li>
            <li>
                <a href="https://ark.analysys.cn/docs/analytics-heatmap.html" target="_blank">
                    <i class="HELP"></i>
                </a>
                <div class="ARKTOOLTIP" style="left:-33px;">
                    <div class="ARROW"></div>
                    <div class="WORDS">帮助文档</span>
                </div>
            </li>
            <li>
                <a href="javascript:void(0)" id="ARK_CLOSE">
                    <i class="RETRACT"></i>
                </a>
                <div class="ARKTOOLTIP" style="left:-21px;">
                    <div class="ARROW"></div>
                    <div class="WORDS">收起</span>
                </div>
            </li>
        </ul>
        <a href="javascript:void(0)" id="ARK_OPEN" class="OPEN">
            <i class="OPENICON"></i>
            <div class="ARKTOOLTIP" style="left: 3px;top: 32px;">
                    <div class="ARROW"></div>
                    <div class="WORDS">展开</div>
                </div>
        </a>
        `
var loading = `
            <div class="ARKLOADING">
                <div class="loadingImg AROUND" id="ARK_HEATMAP_LOADINGImg" style="display:block"></div>
                <div class="noDataImg" id="ARK_HEATMAP_noDataImg" style="display:none"></div>
                <span class="MSG" >生成热图中…</span>
            </div>
            
`
var nodata = `
            <div class="ARKNODATA" id="ARK_HEATMAP_noData">
                <div class="noDataImg"></div>
                <span class="MSG" id="ARK_HEATMAP_noData_MSG">当前设备类型下暂无热图回数</span>
            </div>
`

var headBtnMap = {}
/**
 * [buildHeadEle description] 创建头部导航功能条
 * @return {[type]} [description] 返回可操作按钮元素
 */
function buildHeadEle () {
  var createEle = document.createElement('div')
  createEle.id = 'ARK_HEATMAP_HEAD'
  createEle.className = 'ARK_HEATMAP_HEAD'
  createEle.innerHTML = heapmapTemp
  createEle.style.display = 'none'
  var domBody = document.body
  domBody.appendChild(createEle)

  buildBodyEle()
}

function buildBodyEle () {
  var loadingEle = Util.addEleLable('div', 'ARK_HEATMAP_HEAT_ARKLOADING', 'ARK_HEATMAP_HEAT_ARKLOADING', document.body)
  loadingEle.innerHTML = loading

  var noDataEle = Util.addEleLable('div', 'ARK_HEATMAP_HEAT_ARKNODATA', 'ARK_HEATMAP_HEAT_ARKNODATA', document.body)
  noDataEle.innerHTML = nodata
}

function noDataStatus (code) {
  loadingStatus(false)
  if (code === 200) {
    headBtnMap.noDataEle.style.display = 'none'
    return
  }
  if (code === 0) {
    headBtnMap.noDataMSG.innerHTML = '暂无数据<br/>小舟建议您选择其他时间范围或过滤条件重试'
  } else if (code === 201) {
    var text = '暂无数据<br/>当前设备类型下暂无热图回数'
    if (heatmapConfig.type === 'depth') {
      text = '暂无数据<br/>当前设备类型下暂无深度线回数'
    }
    if (heatmapConfig.type === 'element') {
      text = '暂无数据<br/>当前设备类型下暂无元素热图回数'
    }
    headBtnMap.noDataMSG.innerHTML = text
  } else if (code === 400) {
    headBtnMap.noDataMSG.innerHTML = '参数错误<br/>请在方舟中重新打开查看该页面热图'
  } else if (code === 402) {
    headBtnMap.noDataMSG.innerHTML = '查询异常<br/>请稍后重试 或 联系管理员检查热图服务'
  } else if (code === 100) {
    headBtnMap.noDataMSG.innerHTML = '获取数据失败<br/>当前打开的链接已失效<br/>请在方舟中重新打开查看该页面热图'
  } else if (code === 500) {
    headBtnMap.noDataMSG.innerHTML = '获取数据失败<br/>当前网站中AppKey与方舟项目中AppKey不一致，请修改SDK集成代码'
  } else if (code === 1302) {
    headBtnMap.noDataMSG.innerHTML = '获取数据失败<br/>未开启深度线数据采集'
  }
  headBtnMap.noDataEle.style.display = 'block'
}
/**
 * [loadingStatus description] 设置loading状态
 * @param  {[type]} status [description] true：展示 false：隐藏
 * @return {[type]}        [description]
 */
function loadingStatus (status) {
  if (status === true) {
    headBtnMap.loadingEle.style.display = 'block'
  } else {
    headBtnMap.loadingEle.style.display = 'none'
  }
}
/**
 * [removeClass description] 移除单个Class
 * @param  {[type]} eleList   [description]
 * @param  {[type]} className [description]
 * @return {[type]}           [description]
 */
function removeClass (eleList, className) {
  for (var i = 0; i < eleList.length; i++) {
    if (Util.paramType(eleList[i].className) === 'String') {
      eleList[i].className = eleList[i].className.replace(Util.trim(className), '')
    }
  }
}
/**
 * [addClass description] 增加单个Class
 * @param {[type]} ele       [description]
 * @param {[type]} className [description]
 */
function addClass (ele, className) {
  ele.className += ' ' + Util.trim(className)
}
/**
 * [returnMapEle description] 返回所需按钮元素
 * @return {[type]} [description]
 */
function returnMapEle () {
  var areaEle = document.getElementById('ARK_HEATMAP_HEAD')
  var heatmapTab = document.getElementById('ARKSHOWPOINT')
  var elementMapTab = document.getElementById('ARKSHOWELE')
  var depthMapTab = document.getElementById('ARKSHOWDEP')
  var elementListBtn = document.getElementById('ARK_CONTENT_ELEMENT')
  var elementList = document.getElementById('ARK_SETTING_CONTENT_ELEMENT_LIST')

  var settingBtn = document.getElementById('ARK_SETTING')
  var settingList = document.getElementById('ARK_SETTING_LIST')
  var depthSwitchBtn = document.getElementById('ARK_DEELP_SWITCH')

  var switchBtn = document.getElementById('ARK_HEATMAP_SWITCH_BOX')
  var heatSwitch = document.getElementById('ARK_HEATMAP_SWITCH')

  var leftBtn = document.getElementById('ARK_RANGE_TWO_SLIDER_LEFT')
  var rightBtn = document.getElementById('ARK_RANGE_TWO_SLIDER_RIGHT')
  var leftBg = document.getElementById('ARK_RANGE_TWO_BG_LEFT')
  var rightBg = document.getElementById('ARK_RANGE_TWO_BG_RIGHT')
  var rangeBg = document.getElementById('ARK_RANGE_TWO_BG')
  var rangeEle = document.getElementById('ARK_RANGE_TWO')

  var opacityBtn = document.getElementById('ARK_RANGE_ONE')
  var sliderBg = document.getElementById('ARK_RANGE_ONE_BG')
  var sliderBtn = document.getElementById('ARK_RANGE_ONE_SLIDER')
  var numEle = document.getElementById('ARK_RANGE_ONE_NUM')

  var contentBtn = document.getElementById('ARK_CONTENT_SETTING')
  var contentList = document.getElementById('ARK_SETTING_CONTENT_LIST')

  var openHead = document.getElementById('ARK_OPEN')
  var closeHead = document.getElementById('ARK_CLOSE')

  var refreshBtn = document.getElementById('ARK_REFRESH')

  var crowdsEle = document.getElementById('ARKCONTENTCROWD')
  var conditionsEle = document.getElementById('ARKCONTENTITEM')
  var contentManeEle = document.getElementById('ARK_CONTENT_NAME')

  var noDataEle = document.getElementById('ARK_HEATMAP_HEAT_ARKNODATA')
  var loadingEle = document.getElementById('ARK_HEATMAP_HEAT_ARKLOADING')
  var noDataMSG = document.getElementById('ARK_HEATMAP_noData_MSG')
  var elementMap = document.getElementById('ARK_ELEMENT_MAP')

  var colorRangeEle = document.getElementById('SETTINGCOLOR')
  var bgRangeEle = document.getElementById('SETTINGBG')
  return {
    areaEle: areaEle,
    heatmapTab: heatmapTab,
    elementMapTab: elementMapTab,
    depthMapTab: depthMapTab,
    elementListBtn: elementListBtn,
    settingBtn: settingBtn,
    switchBtn: switchBtn,
    leftBtn: leftBtn,
    rightBtn: rightBtn,
    leftBg: leftBg,
    rightBg: rightBg,
    rangeBg: rangeBg,
    rangeEle: rangeEle,
    opacityBtn: opacityBtn,
    sliderBg: sliderBg,
    sliderBtn: sliderBtn,
    numEle: numEle,
    elementList: elementList,
    settingList: settingList,
    depthSwitchBtn: depthSwitchBtn,
    contentBtn: contentBtn,
    contentList: contentList,
    openHead: openHead,
    closeHead: closeHead,
    refreshBtn: refreshBtn,
    crowdsEle: crowdsEle,
    conditionsEle: conditionsEle,
    contentManeEle: contentManeEle,
    noDataEle: noDataEle,
    loadingEle: loadingEle,
    noDataMSG: noDataMSG,
    elementMap: elementMap,
    heatSwitch: heatSwitch,
    colorRangeEle: colorRangeEle,
    bgRangeEle: bgRangeEle
  }
}

function returnBodyEle () {
  var noDataEle = document.getElementById('ARK_HEATMAP_HEAT_ARKNODATA')
  var loadingEle = document.getElementById('ARK_HEATMAP_HEAT_ARKLOADING')
  var noDataMSG = document.getElementById('ARK_HEATMAP_noData_MSG')
  return {
    noDataEle: noDataEle,
    loadingEle: loadingEle,
    noDataMSG: noDataMSG
  }
}
/**
 * [creatSettingEle description]
 * @return {[type]} [description]
 */
function creatListBtnClick () {
  Util.addEvent(headBtnMap.settingBtn, 'click', function (event) {
    var ele = event.target || event.srcElement
    if (isParent(ele, headBtnMap.settingList)) {
      return
    }
    if (headBtnMap.settingList.style.display === 'block') {
      headBtnMap.settingList.style.display = 'none'
    } else {
      headBtnMap.settingList.style.display = 'block'
    }
    headBtnMap.contentList.style.display = 'none'
    headBtnMap.elementList.style.display = 'none'
  })
  Util.addEvent(headBtnMap.contentBtn, 'click', function (event) {
    var ele = event.target || event.srcElement
    if (isParent(ele, headBtnMap.contentList)) {
      return
    }
    if (headBtnMap.contentList.style.display === 'block') {
      headBtnMap.contentList.style.display = 'none'
    } else {
      headBtnMap.contentList.style.display = 'block'
    }
    headBtnMap.settingList.style.display = 'none'
    headBtnMap.elementList.style.display = 'none'
  })
  Util.addEvent(headBtnMap.elementListBtn, 'click', function (event) {
    var ele = event.target || event.srcElement
    if (isParent(ele, headBtnMap.elementList)) {
      return
    }
    if (headBtnMap.elementList.style.display === 'block') {
      headBtnMap.elementList.style.display = 'none'
    } else {
      headBtnMap.elementList.style.display = 'block'
    }
    headBtnMap.settingList.style.display = 'none'
    headBtnMap.contentList.style.display = 'none'
  })
  Util.addEvent(document, 'click', function (event) {
    var ele = event.target || event.srcElement
    if (isParent(ele, [headBtnMap.settingBtn, headBtnMap.settingList, headBtnMap.contentBtn, headBtnMap.contentList, headBtnMap.elementListBtn, headBtnMap.elementList])) {
      return
    }
    headBtnMap.settingList.style.display = 'none'
    headBtnMap.contentList.style.display = 'none'
    headBtnMap.elementList.style.display = 'none'
  })
}

/**
 * [creatRangeElement description] 初始化滑块操作
 * @return {[type]} [description]
 */
function creatRangeElement () {
  headBtnMap.leftBtn.style.left = 0
  headBtnMap.leftBtn.style.left = 0
  headBtnMap.rightBtn.style.right = 0
  headBtnMap.leftBg.style.width = 0
  headBtnMap.rightBg.style.width = 0
}
/**
 * [creatBgRangeElement description] 初始化背景透明度滑块
 * @return {[type]} [description]
 */
function creatBgRangeElement () {
  headBtnMap.sliderBtn.style.left = parseInt(getConstantStyle(headBtnMap.opacityBtn, 'width')) * 0.3 - parseInt(getConstantStyle(headBtnMap.sliderBtn, 'width')) / 2 + 'px'
  headBtnMap.sliderBg.style.width = parseInt(getConstantStyle(headBtnMap.opacityBtn, 'width')) * 0.7 + parseInt(getConstantStyle(headBtnMap.sliderBtn, 'width')) / 2 + 'px'
  headBtnMap.numEle.innerHTML = '30%'
  headBtnMap.numEle.style.left = parseInt(getConstantStyle(headBtnMap.opacityBtn, 'width')) * 0.3 - parseInt(getConstantStyle(headBtnMap.numEle, 'width')) / 2 + 'px'
}

/**
 * [toggleHead description] 初始化关闭和展开导航条
 * @return {[type]} [description]
 */
function createToggleHead () {
  function toggleHead () {
    headBtnMap.areaEle.style.top = Math.abs(headBtnMap.areaEle.offsetTop) - headBtnMap.areaEle.clientHeight + 'px'
    if (headBtnMap.openHead.style.display === 'block') {
      headBtnMap.openHead.style.display = 'none'
    } else {
      headBtnMap.openHead.style.display = 'block'
    }
  }
  Util.addEvent(headBtnMap.openHead, 'click', toggleHead)
  Util.addEvent(headBtnMap.closeHead, 'click', toggleHead)
}

function createIframeElement () {
  buildBodyEle()
  headBtnMap = returnBodyEle()
}
/**
 * [creatHeadElement description]初始化热图头部导航及操作
 * @return {[type]} [description]
 */
function creatHeadElement () {
  buildHeadEle()
  headBtnMap = returnMapEle()
  var activeEleList = [
    headBtnMap.heatmapTab,
    headBtnMap.elementMapTab,
    headBtnMap.depthMapTab
  ]

  var heatmapClick = function () {
    if (showMapConfig.type !== 'heatmap') {
      headBtnMap.heatSwitch.checked = true
    }
    showMapConfig.type = 'heatmap'
    removeClass(activeEleList, 'active')
    addClass(headBtnMap.heatmapTab, 'active')
    headBtnMap.settingBtn.style.display = 'block'
    headBtnMap.elementListBtn.style.display = 'none'
    headBtnMap.switchBtn.style.display = 'block'
    headBtnMap.colorRangeEle.style.display = 'block'
    headBtnMap.bgRangeEle.style.display = 'block'
  }
  Util.addEvent(headBtnMap.heatmapTab, 'click', heatmapClick)
  var elementMapClick = function () {
    if (showMapConfig.type !== 'element') {
      headBtnMap.heatSwitch.checked = true
    }
    showMapConfig.type = 'element'
    removeClass(activeEleList, 'active')
    addClass(headBtnMap.elementMapTab, 'active')
    headBtnMap.elementListBtn.style.display = 'block'
    headBtnMap.settingBtn.style.display = 'block'
    headBtnMap.switchBtn.style.display = 'block'
    headBtnMap.colorRangeEle.style.display = 'none'
    headBtnMap.bgRangeEle.style.display = 'none'
  }
  Util.addEvent(headBtnMap.elementMapTab, 'click', elementMapClick)

  var depthMapClick = function () {
    showMapConfig.type = 'depth'
    removeClass(activeEleList, 'active')
    addClass(headBtnMap.depthMapTab, 'active')
    headBtnMap.settingBtn.style.display = 'none'
    headBtnMap.elementListBtn.style.display = 'none'
    headBtnMap.switchBtn.style.display = 'none'
  }
  Util.addEvent(headBtnMap.depthMapTab, 'click', depthMapClick)
  if (showMapConfig.type === 'heatmap') {
    heatmapClick()
  } else if (showMapConfig.type === 'element') {
    elementMapClick()
  } else if (showMapConfig.type === 'depth') {
    depthMapClick()
  }
  creatRangeElement()
  creatBgRangeElement()
  creatListBtnClick()
  createToggleHead()
  headBtnMap.areaEle.style.display = 'block'
}
/**
 * [initContent description] 初始化过滤条件
 * @param  {[type]} contentText [description]
 * @return {[type]}             [description]
 */
function initContent () {
  var contentText = showMapConfig.contentText
  if (Util.paramType(contentText) === 'String') {
    try {
      contentText = JSON.parse(contentText)
    } catch (e) { }
  }
  var crowds = contentText.crowds
  var conditions = contentText.filter.conditions
  var relation = contentText.filter.relation
  headBtnMap.crowdsEle.innerHTML = crowds
  var conditionsHtml = ''
  for (var i = 0; i < conditions.length; i++) {
    conditionsHtml += '<li>' + conditions[i] + '</li>'
  }
  var crowdsNum = 0
  if (crowds !== '所有用户') {
    crowdsNum = 1
  }
  if ((conditions.length + crowdsNum) > 0) {
    headBtnMap.contentManeEle.innerHTML = '过滤条件(' + (conditions.length + crowdsNum) + ')'
  }
  if (conditions.length > 1) {
    conditionsHtml += '<li class="ARK_CONTENT_ITEM_RELATION">' + relation + '</li>'
  }
  if (conditions.length > 0) {
    headBtnMap.conditionsEle.innerHTML = conditionsHtml
  }
}

function setElementMap (list) {
  if (!headBtnMap.elementMap) return
  if (!list) {
    headBtnMap.elementMap.innerHTML = ' <tr><td></td><td></td><td>无数据</td><td></td><td></td></tr>'
  } else {
    headBtnMap.elementMap.innerHTML = list
  }
}
export {
  heapmapTemp,
  loading,
  nodata,
  creatHeadElement,
  createIframeElement,
  headBtnMap,
  initContent,
  loadingStatus,
  noDataStatus,
  setElementMap
}
