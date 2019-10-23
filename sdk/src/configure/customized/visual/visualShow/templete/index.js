import './style.css'

var eventHeader = '<div class="ARK_BOX_HEADER mb-20" id="ARK_BOX_HEADER">' +
    '<span class="ARK_BOX_CENTER" id="ARK_BOX_TITLE">{CHANGETEXT}</span>' +
    '<span class="ARK_BOX_CENTER ARK_BOX_SMALL">对选定的页面 UI 元素<span id="ARK_BOX_HEADER_TEXT">{ELETAGNAME}</span>进行命名定义</span>' +
    '</div>'

var eventIDBox = '<div class="ARK_BOX_EVENT_ID">' +
    '<span class="title">事件ID：</span>' +
    '<input id="ARK_BOX_EVENT_ID" type="text" placeholder="事件唯一标识，仅支持字母、数字和下划线" value="{EVENTID}" autocomplete="off">' +
    '<span class="ARK_BOX_EVENT_ID_ERROR" id="ARK_BOX_EVENT_ID_ERROR">仅支持字母、数字和下划线,且以字母开头</span>' +
    '</div>' +
    '<div class="ARK_BOX_EVENT_ID">' +
    '<span class="title">事件名称：</span>' +
    '<input id="ARK_BOX_EVENT_NAME" type="text" placeholder="事件显示名称，用于分析时方便查看" value="{EVENTNAME}" autocomplete="off">' +
    '<span class="ARK_BOX_EVENT_ID_ERROR" id="ARK_BOX_EVENT_NAME_ERROR">建议您命名不超过50个字符,便于阅读</span>' +
    '</div>'

var eventPage = '<div class="ARK_BOX_PAGE mb-15">' +
    '<span class="title">限制条件：</span>' +
    '<div class="boxRadio">' +
    '<label class="mb-8 v-radio-wrapper" for="ARK_BOX_ISPAGE">' +
    '<span class="v-radio-ARK {ISPAGECLASS}">' +
    '<span class="v-radio-inner"></span> ' +
    '<input type="checkbox" class="v-radio-input" name="ARK_BOX_ISPAGE" id="ARK_BOX_ISPAGE" {ISPAGE}>' +
    '</span>  限制在当前页面<span>（未选中表示应用于所有页面）</span>' +
    '</label>' +
    '<label class="mb-8 v-radio-wrapper" for="ARK_BOX_ISTEXT" {ISTEXTDISPLAY}>' +
    '<span class="v-radio-ARK {ISTEXTCLASS}">' +
    '<span class="v-radio-inner"></span> ' +
    '<input type="checkbox" class="v-radio-input" name="ARK_BOX_ISTEXT" id="ARK_BOX_ISTEXT" {ISTEXT}>' +
    '</span> <span id="isTextValue" class="wbText">{EVENTTEXT}</span>' + //无文本
    '</label>' +
    '</div>' +
    '</div>'

var eventSaveBox = '<div class="ARK_BOX_SAVE">' +
    '<button id="ARK_BOX_CANCEL">取消</button>' +
    '<button id="ARK_BOX_SAVE">确认</button>' +
    '</div>'
var eventTemp = eventHeader + eventIDBox + eventPage + eventSaveBox

function setEventTemp(config) {
    if (!config) {
        config = {}
    }
    var text = config.content && config.content.length > 10 ? config.content.substring(0, 10) + '...' : config.content
    var temp = eventTemp.replace('{ELETAGNAME}', config.tagName || '')
        .replace('{CHANGETEXT}',config.isChange?'编辑事件':'创建事件')
        .replace('{EVENTID}', config.appEventId || '')
        .replace('{EVENTNAME}', config.appEventName || '')
        .replace('{ISPAGE}', config.isAll == 1 ? '' : 'checked="checked"')
        .replace('{ISPAGECLASS}', config.isAll == 1 ? '' : 'v-radio-checked')
        .replace('{ISTEXTDISPLAY}', config.content != "" ? '' : 'style="visibility:hidden"')
        .replace('{ISTEXT}', config.isText != "" ? 'checked="checked"' : '')
        .replace('{ISTEXTCLASS}', config.isText != "" ? 'v-radio-checked' : '')
        .replace('{EVENTTEXT}', text != '' ? ('限制在文本： ' + text) : '无文本')
    return temp
}
export { setEventTemp }