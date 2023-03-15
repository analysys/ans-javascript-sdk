import './style.css'
import Util from '../../../../../lib/common/index.js'
var ysMsg = '页面上每个可点击的位置都被视为元素，通过选择元素来圈定当前定义的事件生效范围，即点击哪些位置会上报定义的事件。<br>1 当前文本：指定内容，不区分元素类型，当文本发生变化时，埋点失效。<br>一般用于给某个特定内容文本埋点，<br>比如：<br>圈中按钮上的文字【登录】，当仅选择当前文本时，如果页面上有个非按钮的链接也叫【登录】，则在两处触发点击时，都会上报该事件。<br>2 当前位置：指定位置的元素，当内容发生变化时，埋点仍然有效，页面结构发生变化时，埋点失效。<br>一般用于给某个特定位置埋点。<br>3 同级元素：指与埋点元素的所有父级元素标签类型及元素个数相同的元素，一般用于给列表埋点，可以添加属性，区分同级别但不同内容的元素。<br>4 同类型元素：指与当前埋点元素的Class属性值相同或包含当前埋点元素的Class属性值的元素，点击相同类型的元素时会上报同一个事件，通常可以添加属性，区分同类型但不同内容的元素点击数据。<br>四个选项可以结合使用，<br>比如：<br>可选择当前位置+当前文本来给特定位置上的特定内容埋点<br>可选择当前文本+同类型元素来给相同控件相同名称的'
var ymMsg = '可以选择埋点生效的页面：<br>1 当前页面：指仅在当前页面(URL) 点击相应元素才触发上报该事件<br>2 全部页面：指在所有接入SDK的页面中点击相应元素，都触发上报该事件。比如有非常多的商品详情页，每个页面上都有【加入购物车】按钮，即可选择全部页面，那在任何详情页上点击加入购物车，都会上报到同一个事件中，方便统计分析。'
var eventHeader = '<div class="ARK_BOX_HEADER" id="ARK_BOX_HEADER">' +
  '<span class="ARK_TITLE" id="ARK_BOX_TITLE">{CHANGETEXT}</span>' +
  '<span class="ARK_BOX_CENTER ARK_BOX_SMALL">(可拖动)</span>' +
  '</div>'

var eventIDBox = '<div class="ARK_EVENT"><span class="ARK_TITLE MID">定义事件</span>' +
  '<div class="ARK_BOX_EVENT_ID">' +
  '<span class="ARK_TITLE SM">事件ID</span>' +
  '<input id="ARK_BOX_EVENT_ID" type="text" placeholder="事件唯一标识，仅支持字母、数字和下划线" value="{EVENTID}" autocomplete="off">' +
  '<span class="ARK_BOX_EVENT_ID_ERROR" id="ARK_BOX_EVENT_ID_ERROR">仅支持字母、数字和下划线,且以字母开头</span>' +
  '</div>' +
  '<div class="ARK_BOX_EVENT_ID">' +
  '<span class="ARK_TITLE SM">事件名称</span>' +
  '<input id="ARK_BOX_EVENT_NAME" type="text" placeholder="事件显示名称，用于分析时方便查看" value="{EVENTNAME}" autocomplete="off">' +
  '<span class="ARK_BOX_EVENT_ID_ERROR" id="ARK_BOX_EVENT_NAME_ERROR">建议您命名不超过50个字符,便于阅读</span>' +
  '</div>' +
  '<span class="ARK_TITLE MID">事件属性</span>' +
  '</div>'

var eventProItem = '<li class="ARK_PRO_ITEM">' +
  '<div class="ARK_BOX_EVENT_ID">' +
  '<span class="ARK_TITLE SM">属性ID</span>' +
  '<input class="PROID" type="text" placeholder="请输入..." value="{PRONAME}" autocomplete="off">' +
  '<ul class="ARK_SCROLLBAR ARK_DROPDOWN">' +
  '<li data-type="string" class="selected"><span>字符串</span></li>' +
  '<li data-type="number"><span>数值</span></li>' +
  '<li data-type="bool"><span>布尔值</span></li>' +
  '</ul>' +
  '<span class="ARK_BOX_EVENT_ID_ERROR">建议您命名不超过50个字符,便于阅读</span>' +
  '</div>' +
  '<div class="ARK_BOX_EVENT_ID fl">' +
  '<span class="ARK_TITLE SM fl mr-12">属性值</span>' +
  '<label class="v-radio-wrapper fl" for="ARK_BOX_PRO_ITEM">' +
  '<span class="v-radio-ARK {ISINPUTCLASS}">' +
  '<span class="v-radio-inner"></span> ' +
  '<input type="radio" class="v-radio-input" name="ARK_BOX_PRO_ITEM" id="ARK_PRO_INPUT">' +
  '</span>手动输入值' +
  '</label>' +
  '<label class="v-radio-wrapper fl" for="ARK_BOX_PRO_ITEM">' +
  '<span class="v-radio-ARK {ISPROELECLASS}">' +
  '<span class="v-radio-inner"></span> ' +
  '<input type="radio" class="v-radio-input" id="ARK_PRO_ELEMENT" name="ARK_BOX_PRO_ITEM">' +
  '</span>从页面选择' +
  '</label>' +
  '</div>' +
  '<div class="ARK_BOX_EVENT_ID fr textR">' +
  '<input class="PROVALUE fl" type="text" placeholder="请输入属性值" value="{PROVALUE}" autocomplete="off" {PROVALUEDISABLED} data-ark-value="{PROBASEVALUE}">' +
  '<span class="ARK_BOX_EVENT_ID_ERROR" id="ARK_BOX_EVENT_NAME_ERROR">建议您命名不超过50个字符,便于阅读</span>' +
  '<button class="ARK_ICON ICON_XQ fl  ml-8 "></button>' +
  '<button class="ARK_ICON ICON_REX fl {PROREXACTIVE}"></button>' +
  '</div>' +
  '<div class="ARK_BOX_EVENT_ID fr textR ">' +
  '<input class="PROREX fl" type="text" placeholder="输入正则表达式" value="{PROREXVALUE}" autocomplete="off">' +
  '<span class="ARK_BOX_EVENT_ID_ERROR" id="ARK_BOX_EVENT_NAME_ERROR">建议您命名不超过50个字符,便于阅读</span>' +
  '<button class="ARK_ICON ICON_NUM fl  ml-8 "></button>' +
  '</div>' +
  '<div class="ARK_BOX_EVENT_ID fl">' +
  '<span class="ARK_TITLE SM fl">数据类型</span>' +
  '<input class="PROTYPE" type="text" readonly="readonly" autocomplete="off" value="{PROTYPE}" autocomplete="off" data-type="{PROTYPEDATA}"/>' +
  '<ul class="ARK_SCROLLBAR ARK_DROPDOWN">' +
  '<li data-type="string"><span>字符串</span></li>' +
  '<li data-type="number"><span>数值</span></li>' +
  '<li data-type="bool"><span>布尔值</span></li>' +
  '</ul>' +
  '</div>' +
  '<button class="ARK_ICON ICON_DEL"></button>' +
  '<div class="ARK_FIXED_BOX"></div>'
'</li>'
var eventPorListStart = '<div class="ARK_CONTENT ARK_SCROLLBAR">' +
  '<div  class="ARK_BOX_EVENT_ID">' +
  '<ul class="PROLIST ARK_SCROLLBAR" id="ARK_PRO_LIST">'

var eventPorListEnd = '</ul>' +
  '<div  class="ARK_BOX_EVENT_ID">' +
  '<button class="ARK_ADD_PRO" id="ARK_ADD_PRO"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAACtJREFUGBljYMACRDof/ccizMCETRCX2CBRzIjLM7jcjSGOy4BB4kGSnAEAOzgHjMbmwEkAAAAASUVORK5CYII="/>添加属性</button>' +
  '</div>' +
  '</div>'
var eventPage = '<span class="ARK_TITLE MID">生效范围</span>' +

  '<div class="ARK_BOX_PAGE fl mb-15 pb-20">' +
  '<span class="ARK_TITLE SM fl mr-25">圈定元素</span><i class="ARK_ICON ICON_I" data-ark-tip="' + ysMsg + '" data-ark-tip-pos="{\'top\':\'-209px\',\'left\':\'81px\',\'pos\':\'right\'}"></i>' +
  '<div class="boxRadio">' +
  '<label class="v-radio-wrapper" for="ARK_PATH_ISPAGE">' +
  '<span class="v-radio-ARK {ISPATHPAGE}">' +
  '<span class="v-radio-inner"></span> ' +
  '<input type="checkbox" class="v-radio-input" name="ARK_PATH_ISPAGE" id="ARK_PATH_ISPAGE">' +
  '</span>当前位置' +
  '</label>' +
  '<label class="v-radio-wrapper" for="ARK_CONTENT_ISPAGE" title="{EVENTTEXTTITLE}">' +
  '<span class="v-radio-ARK {ISCONTENTPAGE}">' +
  '<span class="v-radio-inner"></span> ' +
  '<input type="checkbox" class="v-radio-input" name="ARK_CONTENT_ISPAGE" id="ARK_CONTENT_ISPAGE" >' +
  '</span>当前内容:{EVENTTEXT}' +
  '</label>' +
  '<label class="v-radio-wrapper" for="ARK_CLASS_ISPAGE">' +
  '<span class="v-radio-ARK {ISCLASSPAGE}">' +
  '<span class="v-radio-inner"></span> ' +
  '<input type="checkbox" class="v-radio-input" name="ARK_CLASS_ISPAGE" id="ARK_CLASS_ISPAGE">' +
  '</span>同类型元素' +
  '</label>' +
  '<label class="v-radio-wrapper" for="ARK_LIST_ISPAGE">' +
  '<span class="v-radio-ARK {ISLISTPAGE}">' +
  '<span class="v-radio-inner"></span> ' +
  '<input type="checkbox" class="v-radio-input" name="ARK_LIST_ISPAGE" id="ARK_LIST_ISPAGE">' +
  '</span>同级元素' +
  '</label>' +
  '</div>' +
  '<div class="ARK_BOX_EVENT_ID fl mb-40">' +
  '<span class="ARK_TITLE SM mr-12">生效页面</span><i class="ARK_ICON ICON_I" data-ark-tip="' + ymMsg + '" data-ark-tip-pos="{\'top\':\'-68px\',\'left\':\'81px\',\'pos\':\'right\'}"></i>' +
  '<input class="PAGETYPE" type="text" readonly="readonly" autocomplete="off" value="{PAGENAME}" autocomplete="off" id="ARK_BOX_ISPAGE" data-type="{PAGENAMETYPE}"/>' +
  '<ul class="ARK_DROPDOWN" >' +
  '<li data-type="isPage"><span>当前页面</span></li>' +
  '<li data-type="isAll"><span>全部页面</span></li>' +
  '</ul>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '</div>'

var eventSaveBox = '<div class="ARK_BOX_EVENT_ID ARK_BOX_SAVE fl">' +
  '<button id="ARK_BOX_CANCEL">取消</button>' +
  '<button id="ARK_BOX_SAVE">确认</button>' +

  '</div>'



function setEventTemp (config) {
  if (!config) {
    config = {}
  }
  var text = config.content && config.content.length > 10 ? config.content.substring(0, 10) + '...' : config.content
  var relateds = config.related || []
  var properties = config.properties || []
  var bindings = config.props_binding || []
  var proTemp = ''
  var isList = false
  if (config.new_path && config.newPath && JSON.stringify(config.new_path).indexOf('"row"') < 0 && JSON.stringify(config.newPath).indexOf('"row"') > -1) {
    isList = true
  }
  if (relateds.length > 0) {
    for (var i = 0; i < relateds.length; i++) {
      var type = relateds[i].properties[0].prop_type
      var typeName = '字符串'
      if (type === 'bool') {
        typeName = '布尔值'
      } else if (type === 'number') {
        typeName = '数值'
      }
      var value = relateds[i].properties[0].value
      var regex = relateds[i].properties[0].regex
      if (regex) {
        try {
          regex = Util.decode(regex)
          var _regex = new RegExp(regex)
          var regexVal = _regex.exec(value)
          if (regexVal && regexVal.length > 0) {
            value = regexVal[0]
          }
        } catch (e) { }
        relateds[i].properties[0].regex = regex
      }
      proTemp += eventProItem.replace('{PRONAME}', relateds[i].properties[0].key)
        .replace('{PROVALUE}', value || '--')
        .replace('{PROVALUEDISABLED}', 'disabled')
        .replace('{ISPROELECLASS}', 'v-radio-checked')
        .replace('{PROREXACTIVE}', relateds[i].properties[0].regex ? 'active' : '')
        .replace('{PROREXVALUE}', relateds[i].properties[0].regex || '')
        .replace('{PROBASEVALUE}', relateds[i].properties[0].value)
        .replace('{PROTYPE}', typeName)
        .replace('{PROTYPEDATA}', type)
    }
  }
  if (properties.length > 0) {
    for (var y = 0; y < properties.length; y++) {
      var proType = properties[y].prop_type
      var proTypeName = '字符串'
      if (proType === 'bool') {
        proTypeName = '布尔值'
      } else if (proType === 'number') {
        proTypeName = '数值'
      }
      proTemp += eventProItem.replace('{PRONAME}', properties[y].key)
        .replace('{PROVALUE}', properties[y].value || '')
        .replace('{ISINPUTCLASS}', 'v-radio-checked')
        .replace('{PROVALUEDISABLED}', '')
        .replace('{ISPROELECLASS}', '')
        .replace('{PROTYPE}', proTypeName)
        .replace('{PROTYPEDATA}', proType)
        .replace('{PROREXVALUE}', '')
        .replace('{PROBASEVALUE}', '')
    }
  }

  var eventTemp = eventHeader + eventIDBox + eventPorListStart + proTemp + eventPorListEnd + eventPage + eventSaveBox
  var temp = eventTemp.replace('{CHANGETEXT}', config.isChange ? '编辑事件' : '创建事件')
    .replace('{EVENTID}', config.appEventId || '')
    .replace(/{EVENTNAME}/g, config.appEventName || '')
    .replace('{PAGENAME}', config.isAll === 1 ? '全部页面' : '当前页面')
    .replace('{PAGENAMETYPE}', config.isAll === 1 ? 'isAll' : 'isPage')
    .replace(/{EVENTTEXT}/g, text || '')
    .replace(/{EVENTTEXTTITLE}/, config.content || '')
    .replace('{ISPATHPAGE}', config.new_path ? 'v-radio-checked' : '')
  for (var z = 0; z < bindings.length; z++) {
    var binding = bindings[z]
    if (binding.prop_name === 'class') {
      temp = temp.replace('{ISCLASSPAGE}', 'v-radio-checked')
    } else if (binding.prop_name === 'text') {
      temp = temp.replace('{ISCONTENTPAGE}', 'v-radio-checked')
    }
  }
  temp = temp.replace(/{ISCLASSPAGE}/g, '')
    .replace(/{ISCONTENTPAGE}/g, '')
    .replace(/{ISLISTPAGE}/g, isList === true ? 'v-radio-checked' : '')
  return temp
}

function setProItemTemp () {
  var proTemp = eventProItem.replace('{PRONAME}', '')
    .replace('{PROVALUE}', '')
    .replace('{ISINPUTCLASS}', 'v-radio-checked')
    .replace('{PROVALUEDISABLED}', '')
    .replace('{PROTYPE}', '字符串')
    .replace('{PROTYPEDATA}', 'string')
    .replace('{PROREXVALUE}', '')
    .replace('{PROBASEVALUE}', '')
  return proTemp
}
export { setEventTemp, setProItemTemp }
