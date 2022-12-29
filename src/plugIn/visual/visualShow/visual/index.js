import { setEventTemp, setProItemTemp } from '../templete/index.js'
import Util from '../../utils'
import { isParent, setIndex, domParentList, parseEvent, boxPosition, parserPageEvents, backH5PathProPath, parseNewPath, delPathRow, checkNewPathBase, pathContrast } from '../common/index.js'
import { getElementContent } from '../../utils/elementContent.js'
import { sendMsg } from '../common/iframeMsg.js'
import { $lib_version } from '../../../../constant/index.ts'
import { setDebugTemp } from '../templete/debug.js'
import moveBox from '../common/boxMove.js'
/**
 * 添加关联元素属性及样式
 */
function addProEleBox () {
  var step = 0
  var proPath = Util.arrayMerge([], proEleObj.newPath)
  var clickPath = Util.arrayMerge([], clickOpenEle.newPath)
  clickPath = clickPath.reverse()
  proPath = proPath.reverse()

  var status = true
  while (step < clickPath.length && status === true) {
    if (!clickPath[step] || !proPath[step]) {
      status = false
    } else {
      for (var item in clickPath[step]) {
        if (clickPath[step][item] !== proPath[step][item]) {
          status = false
        }
      }
    }

    if (status === false) {
      break
    }
    step++
  }
  if (step > 0) {
    proPath.splice(0, step - 1)
  }
  if (step === 0) {
    proPath[0] = clickPath[0]
  }
  var num = clickOpenEle.newPath.length - step
  var proRelated = {
    target: {
      h5_path: proPath.reverse(),
      step: num
    }
  }
  proEle.setAttribute('data-ark-related', JSON.stringify(proRelated))
  var value = getElementContent(proEleObj.ele, true)
  proEle.value = value || '--'
  if (value) {
    proEle.setAttribute('data-ark-value', value)

  }
  var activeIcon = proEle.parentNode.getElementsByClassName('ICON_XQ')
  if (activeIcon.length > 0) {
    activeIcon = activeIcon[0]
    activeIcon.className = activeIcon.className.replace(/ active/g, '')
  }
  var hoverEles = document.getElementsByClassName('ARK_SAVE_DISPOSE')
  for (var i = 0; i < hoverEles.length; i++) {
    hoverEles[i].style.display = 'block'
  }

  var proDiv = setOnceBox(proEleObj.ele, '', 'ARK_SAVE_PRO')
  proEleObj.ele.parentNode.appendChild(proDiv)

  var showPro = document.getElementById('ARK_PRO')
  if (showPro) {
    var showProParent = showPro.parentNode || document.body
    showProParent.removeChild(showPro)
  }
  isAddPro = false
}
var clickOpenEle = null
var relatedLength = 0

function openVisualBox () {
  relatedLength = 0
  if (!clickEleObj.ele) return
  clickOpenEle = Util.toDeep(clickEleObj)
  var ele = clickOpenEle.ele

  // var eleParent = ele.parentNode || document.body
  delClickBox()

  // checkChildrenEvent(ele)
  var tagName = ele.tagName
  var hash = window.location.hash
  if (hash.indexOf('?') > -1) {
    hash = hash.split('?')[0]
  }
  var config = {
    id: 0,
    url: window.location.protocol + '//' + window.location.host + window.location.pathname + hash,
    tagName: tagName,
    appEventId: '',
    appEventName: '',
    isAll: 0,
    allVersion: 0,
    dispose: 0,
    isText: '',
    link: clickOpenEle.path,
    index: clickOpenEle.index,
    content: getElementContent(ele),
    classes: Util.paramType(ele.className) === 'String' ? ele.className : '',
    isChange: false,
    related: [],
    properties: [],
    props_binding: [],
  }
  var eventAttri = ele.getAttribute('data-ark-attr')
  if (eventAttri) {
    eventAttri = JSON.parse(eventAttri)
    config = Util.objMerge(config, eventAttri)
    config.isChange = true
    config.new_path = eventAttri.new_path
    config.related = eventAttri.related || []
    config.props_binding = eventAttri.props_binding || []
    config.properties = eventAttri.properties || []
    for (var y = 0; y < config.props_binding.length; y++) {
      if (config.props_binding[y].prop_name === 'class') {
        config.classes = config.props_binding[y].value
      }
    }
  }
  config.newPath = Util.arrayMerge([], clickOpenEle.newPath)
  clickDiv = setOnceBox(ele, 'ARK_SAVE_CLICK', 'ARK_SAVE_CLICK')
  clickDiv.innerHTML = '<span class="ARK_IS_EDIT">编辑中</span>'
  var parentEle = ele.parentNode || document.body
  parentEle.appendChild(clickDiv)

  var relateds = config.related || []
  relatedLength = relateds.length
  setElementRelatedsDisable()
  if (relateds.length > 0) {
    for (var i = 0; i < relateds.length; i++) {
      var eRelated = relateds[i].target
      eRelated.newPath = eRelated.h5_path
      if (eRelated.h5_path) {
        var relatedPath = backH5PathProPath(config.newPath, eRelated)
        var relatedEele = parseNewPath(relatedPath, eRelated.step, clickEleObj.ele)
        if (relatedEele) {
          var value = relatedEele ? getElementContent(relatedEele, true) : ''
          relateds[i].properties[0].value = value
          var id = config.id + 'pro' + i
          var proDiv = setOnceBox(relatedEele, id, 'ARK_SAVE_PRO')
          relatedEele.parentNode.appendChild(proDiv)
        }
      }
    }
  }
  config.url = window.location.protocol + '//' + window.location.host + window.location.pathname + hash
  var clickBoxTemp = setEventTemp(config)
  var clickDiv = document.createElement('div')
  clickDiv.className = 'ARK_BOX'
  clickDiv.id = 'ARK_BOX'
  clickDiv.innerHTML = clickBoxTemp
  if (boxOption.left !== null && boxOption.top !== null) {
    clickDiv.style.left = boxOption.left
    clickDiv.style.top = boxOption.top
  }
  document.body.appendChild(clickDiv)

  initClickBoxActive(clickDiv, config)
  sendMsg({
    type: 'pointList',
    close: true
  })
}

function isTextAndIsAllEleClick (e) {
  var ele = (e || window.event).target
  var parentEle = ele.parentNode
  var eleChecked = ele.getAttribute('checked')
  if (eleChecked !== 'checked') {
    parentEle.className += ' v-radio-checked'
    ele.setAttribute('checked', 'checked')
  } else {
    parentEle.className = parentEle.className ? parentEle.className.replace(/ v-radio-checked/g, '') : ''
    ele.removeAttribute('checked')
  }
}

function inputOnblur (e) {
  var ele = e.target || e.srcElement
  var nextEle = ele.nextSibling
  var value = ele.value || ''
  var eleId = ele.id

  var status = true
  if (eleId === 'ARK_BOX_EVENT_ID') {
    // to do
    // status = checkPrivate(value, '$track', true)
    if (!/^[a-zA-Z$][a-zA-Z0-9_]{1,99}$|^[a-zA-Z]$/.test(value)){
      status = false
    }
  } else {
    if (value && value.length > 50) {
      status = false
    }
  }

  if (!status) {
    ele.className += ' error'
    nextEle.style.display = 'block'
  }
}

function inputOnfocus (e) {
  var ele = e.target || e.srcElement
  var nextEle = ele.nextSibling
  ele.className = ele.className ? ele.className.replace(/ error/g, '') : ''
  nextEle.style.display = 'none'
}

function addProItem () {
  var proItemTemp = setProItemTemp()
  var proDiv = document.createElement('div')
  proDiv.innerHTML = proItemTemp
  var proItem = proDiv.childNodes[0]
  var proListEls = document.getElementById('ARK_PRO_LIST')
  proListEls.appendChild(proItem)
  proListEls.scrollTop = proListEls.scrollHeight
  setRelatedsActive(proItem, {})
  setElementRelatedsDisable()
}
function getChildEle (ele, className) {
  var chileEles = ele.childNodes
  var eleChild = null
  for (var i = 0; i < chileEles.length; i++) {
    if (chileEles[i].nodeType === 1) {
      if (Util.paramType(chileEles[i].className) === 'String' && chileEles[i].className.split(' ').indexOf(className) > -1) {
        // eleList.push(chileEles[i])
        eleChild = chileEles[i]
      }
      if (!eleChild && chileEles[i].childNodes.length > 0) {
        eleChild = getChildEle(chileEles[i], className)
      }
    }
  }
  return eleChild
}
var isAddPro = false
var proEle = null
function setRelatedsActive (ele, related) {
  var clickEles = ele.getElementsByClassName('v-radio-wrapper')
  var inputKey = getChildEle(ele, 'PROID')
  var inputValue = getChildEle(ele, 'PROVALUE')
  var inputRegex = getChildEle(ele, 'PROREX')
  var inputType = getChildEle(ele, 'PROTYPE')
  var iconXQ = getChildEle(ele, 'ICON_XQ')
  var iconREX = getChildEle(ele, 'ICON_REX')
  var iconNUM = getChildEle(ele, 'ICON_NUM')
  var iconDel = getChildEle(ele, 'ICON_DEL')
  inputValue.setAttribute('data-ark-related', JSON.stringify(related))

  for (var i = 0; i < clickEles.length; i++) {
    var spanRadio = getChildEle(clickEles[i], 'v-radio-ARK')
    var checkedInput = getChildEle(clickEles[i], 'v-radio-input')

    if (spanRadio.className.indexOf('v-radio-checked') > -1 && i === 0) {
      checkedInput.setAttribute('checked', 'checked')
      inputValue.className += ' width246'
      inputRegex.style.display = 'none'
      iconXQ.style.display = 'none'
      iconREX.style.display = 'none'
      iconNUM.style.display = 'none'
      iconXQ.className = iconXQ.className.replace(/ active/g, '')
      iconREX.className = iconREX.className.replace(/ active/g, '')
      iconNUM.className = iconNUM.className.replace(/ active/g, '')
      inputValue.removeAttribute('disabled')
      inputValue.removeAttribute('data-ark-related')
      inputValue.removeAttribute('data-ark-value')


    } else if (spanRadio.className.indexOf('v-radio-checked') > -1 && i === 1) {
      checkedInput.setAttribute('checked', 'checked')
      inputValue.setAttribute('disabled', 'disabled')
      iconXQ.style.display = 'block'
      iconREX.style.display = 'block'
      if (inputRegex.value === '') {
        iconREX.className = iconREX.className.replace(/ active/g, '')
      }
      inputValue.className = inputValue.className.replace(/ width246/g, '')
      if (!related.properties[0].regex || related.properties[0].regex === '') {
        inputRegex.style.display = 'none'
        iconNUM.style.display = 'none'
      }
    }
  }
  Util.addEvent(inputKey, 'input', setProInputChange)

  Util.addEvent(inputRegex, 'input', function () {
    var initValue = inputValue.getAttribute('data-ark-value')

    var rexegValue = inputRegex.value
    try {
      var value = initValue || inputValue.value
      if (!value) return
      if (!rexegValue) {
        inputValue.value = value
        return
      }
      var _regex = new RegExp(rexegValue)

      var regexVal = _regex.exec(value)
      if (regexVal && regexVal.length > 0) {
        inputValue.value = regexVal[0]
      } else {
        inputValue.value = value
      }
    } catch (e) {
      inputValue.value = value
    }
  })

  function isAddProActive () {
    isAddPro = true
    iconXQ.className += ' active'
    proEle = inputValue
    var relateAttr = inputValue.getAttribute('data-ark-related')
    var isElementRelate = false
    if (inputValue.getAttribute('checked') === 'checked') {
      isElementRelate = true
    }
    if (relateAttr) {
      var eRelated = JSON.parse(relateAttr).target
      if (eRelated.h5_path) {
        var relatedPath = backH5PathProPath(Util.arrayMerge([], clickOpenEle.newPath), eRelated)
        var relatedEele = parseNewPath(relatedPath, eRelated.step, clickEleObj.ele)
        if (relatedEele) {
          var relateEle = getChildEle(relatedEele.parentNode, 'ARK_SAVE_PRO')

          relateEle && relateEle.parentNode.removeChild(relateEle)
          // relateds['ele'] = proDiv
          // document.body.appendChild(proDiv)
        }
      }
      isElementRelate = true
    }
    return isElementRelate
  }
  function notAddProActive () {
    isAddPro = false
    var iconXQList = document.getElementsByClassName('ICON_XQ')
    for (var i = 0; i < iconXQList.length; i++) {
      iconXQList[i].className = iconXQList[i].className.replace(/ active/g, '')

    }
    proEle = null
  }
  Util.addEvent(iconXQ, 'click', function () {
    if (isAddPro === true) {
      notAddProActive()
    } else {
      isAddProActive()
    }
  })
  Util.addEvent(iconREX, 'click', function () {
    notAddProActive()
    if (iconNUM.style.display !== 'none') {
      iconNUM.style.display = 'none'
      inputRegex.style.display = 'none'
      iconREX.className = iconREX.className.replace(/ active/g, '')
    } else {
      iconNUM.style.display = 'block'
      inputRegex.style.display = 'block'
      iconREX.className += ' active'
    }

    inputRegex.value = ''
  })
  Util.addEvent(iconNUM, 'click', function () {
    notAddProActive()
    var initValue = inputValue.getAttribute('data-ark-value')

    var rexegValue = '[\\d.]+'
    inputRegex.value = rexegValue
    try {
      var value = initValue || inputValue.value
      var _regex = new RegExp(rexegValue)
      var regexVal = _regex.exec(value)
      if (regexVal.length > 0) {
        inputValue.value = regexVal[0]
      }
    } catch (e) { }
  })
  for (var y = 0; y < clickEles.length; y++) {

    Util.addEvent(clickEles[y], 'click', (function (index) {
      return function () {

        var ele = clickEles[index]
        var checkInput = getChildEle(ele, 'v-radio-input')
        var checkSpan = getChildEle(ele, 'v-radio-ARK')
        if (checkSpan.className.indexOf('v-radio-checked') < 0 && checkInput.disabled !== true) {
          checkSpan.className += ' v-radio-checked'
          checkInput.setAttribute('checked', 'checked')
          var elementEle = ele.nextSibling

          if (checkInput.id === 'ARK_PRO_ELEMENT') {
            isAddProActive()
            elementEle = ele.previousSibling
            inputValue.setAttribute('placeholder', '--')
            inputValue.setAttribute('disabled', 'disabled')
            inputValue.value = ''
            inputRegex.value = ''
            iconXQ.style.display = 'block'
            iconREX.style.display = 'block'
            iconREX.className = iconREX.className.replace(/ active/g, '')
            inputValue.className = inputValue.className.replace(/ width246/g, '')
            relatedLength++
          } else {
            notAddProActive()
            inputValue.setAttribute('placeholder', '请输入属性值')
            inputValue.value = ''
            inputRegex.value = ''
            inputValue.className += ' width246'
            inputRegex.style.display = 'none'
            iconXQ.style.display = 'none'
            iconREX.style.display = 'none'
            iconNUM.style.display = 'none'
            iconXQ.className.replace(/ active/g, '')
            iconREX.className.replace(/ active/g, '')
            iconNUM.className.replace(/ active/g, '')
            inputValue.removeAttribute('disabled')
            var relateAttr = inputValue.getAttribute('data-ark-related')
            if (relateAttr) {
              var eRelated = JSON.parse(relateAttr).target
              if (eRelated.h5_path) {
                var relatedPath = backH5PathProPath(Util.arrayMerge([], clickOpenEle.newPath), eRelated)
                var relatedEele = parseNewPath(relatedPath, eRelated.step, clickEleObj.ele)
                if (relatedEele) {
                  var relateEle = getChildEle(relatedEele.parentNode, 'ARK_SAVE_PRO')

                  relateEle && relateEle.parentNode.removeChild(relateEle)
                  // relateds['ele'] = proDiv
                  // document.body.appendChild(proDiv)
                }
              }
            }
            inputValue.removeAttribute('data-ark-related')
            inputValue.removeAttribute('data-ark-value')
            relatedLength--
          }
          var elementInput = getChildEle(elementEle, 'v-radio-input')
          var elementSpan = getChildEle(elementEle, 'v-radio-ARK')
          elementSpan.className = checkSpan.className.replace(/ v-radio-checked/g, '')
          elementInput.removeAttribute('checked')
          setElementRelatedsDisable()

        }
      }
    })(y))
  }

  Util.addEvent(iconDel, 'click', function () {
    var isElementR = isAddProActive()
    if (isElementR === true) {
      relatedLength--
    }
    isAddPro = false
    ele.parentNode.removeChild(ele)
    setElementRelatedsDisable()
  })
  Util.addEvent(inputType, 'click', function () {

    var proTypeList = inputType.nextSibling
    proTypeList.className = proTypeList.className.replace(/ TOP/g, '')
    var isType = inputType.getAttribute('data-type')
    if (!ele.nextSibling) {
      proTypeList.className += ' TOP'
    }

    proTypeList.style.display = 'block'
    var liEles = proTypeList.childNodes
    for (var i = 0; i < liEles.length; i++) {
      var type = liEles[i].getAttribute('data-type')
      liEles[i].className = liEles[i].className.replace(/selected/g, '')
      if (isType === type) {
        liEles[i].className += 'selected'
      }
      liEles[i].onclick = (function (ele) {
        return function () {
          var type = ele.getAttribute('data-type')
          for (var y = 0; y < liEles.length; y++) {
            liEles[y].className = liEles[y].className.replace(/selected/g, '')
          }
          inputType.value = ele.innerText
          ele.className += 'selected'
          inputType.setAttribute('data-type', type)
          proTypeList.style.display = 'none'
        }
      })(liEles[i])
    }
  })

}
function setElementRelatedsDisable () {
  var isDisable = false
  if (relatedLength >= 5) {
    isDisable = true
  }
  var ulEle = document.getElementById('ARK_PRO_LIST')
  if (!ulEle) {
    return
  }
  var liEles = ulEle.getElementsByClassName('ARK_PRO_ITEM')
  for (var i = 0; i < liEles.length; i++) {
    var inputEles = liEles[i].getElementsByClassName('v-radio-input')
    var valueEle = inputEles[0]
    var elementEle = inputEles[1]
    if (valueEle.getAttribute('checked') === 'checked') {
      var pathParentEle = elementEle.parentNode.parentNode
      if (isDisable) {
        if (pathParentEle.className.indexOf(' v-radio-wrapper-disabled') < 0) {
          pathParentEle.className += ' v-radio-wrapper-disabled'
          elementEle.setAttribute('disabled', 'disabled')
          pathParentEle.setAttribute('data-ark-tip', '关联元素个数达到上限，最多可关联5个元素！')
          pathParentEle.setAttribute('data-ark-tip-pos', JSON.stringify({ left: '45px' }))
        }
      } else {
        pathParentEle.className = pathParentEle.className.replace(/ v-radio-wrapper-disabled/g, '')
        elementEle.removeAttribute('disabled', 'disabled')
        pathParentEle.removeAttribute('data-ark-tip')
      }
    }
  }
}
var showProInputList = []
function backProInputList (obj) {
  var num = null
  for (var i = 0; i < showProInputList.length; i++) {
    if (obj.id === showProInputList[i].id) {
      showProInputList[i].callback(obj)
      num = 1
    }
  }
  showProInputList.splice(num, 1)
}
function setProInputChange (e) {
  var inputValue = (e || window.event).target
  var value = inputValue.value
  var ulEle = inputValue.nextSibling
  var parentEle = inputValue.parentNode.parentNode
  var proTypeEle = parentEle.getElementsByClassName('PROTYPE')[0]
  // proTypeEle.setAttribute('data-type', 'string')
  proTypeEle.removeAttribute('disabled')
  // proTypeEle.value = '字符串'
  ulEle.innerHTML = ''
  ulEle.style.display = 'none'
  ulEle.style.maxHeight = '130px'
  if (value === '') {
    return
  }

  var callback = function (msg) {
    var data = msg.data
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var liEles = document.createElement('li')
        liEles.innerHTML = '<span>' + data[i].code + '</span>'
        ulEle.appendChild(liEles)
        liEles.onclick = (function (data) {
          return function () {
            var type = data.dataType
            var name = '字符串'

            inputValue.value = data.code
            ulEle.style.display = 'none'
            if (type === 'boolean') {
              type = 'bool'
              name = '布尔值'
            } else if (type === 'number') {
              name = '数值'
            }
            proTypeEle.value = name
            proTypeEle.setAttribute('data-type', type)
            proTypeEle.setAttribute('disabled', 'disabled')
          }
        })(data[i])
      }
      ulEle.style.display = 'block'
    }
  }
  var id = +new Date()
  showProInputList.push({
    id: id,
    callback: callback
  })
  // callback({ data: [{ code: '234' }, { code: '344' }, { code: '1222' }] })
  sendMsg({
    code: 200,
    type: 'pro_like',
    id: id,
    key: inputValue.value
  })
}
function changeBindings (config) {
  clearDisposeEles()
  var newEvent = [{
    newPath: config.new_path ? Util.arrayMerge([], config.new_path) : null,
    bindings: Util.arrayMerge([], config.props_binding)
  }]
  var eles = parserPageEvents(newEvent)
  for (var y = 0; y < eles.length; y++) {
    if (clickOpenEle.ele !== eles[y].ele) {
      setShowDoms(eles[y].ele)
    }
    // setVisualEvent(eles[y].ele, eles[y].config, y)
  }
}
function initClickBoxActive (ele, config) {
  var saveEle = document.getElementById('ARK_BOX_SAVE')
  var cancelEle = document.getElementById('ARK_BOX_CANCEL')
  var isTextEle = document.getElementById('ARK_CONTENT_ISPAGE')
  var isClassEle = document.getElementById('ARK_CLASS_ISPAGE')
  var isPathEle = document.getElementById('ARK_PATH_ISPAGE')
  var isListEle = document.getElementById('ARK_LIST_ISPAGE')
  var isPageEle = document.getElementById('ARK_BOX_ISPAGE')
  var eventIDEle = document.getElementById('ARK_BOX_EVENT_ID')
  var eventIdErrorEle = document.getElementById('ARK_BOX_EVENT_ID_ERROR')
  var eventNameEle = document.getElementById('ARK_BOX_EVENT_NAME')
  var eventNameErrorEle = document.getElementById('ARK_BOX_EVENT_NAME_ERROR')
  var headMove = document.getElementById('ARK_BOX_HEADER')
  var addProEle = document.getElementById('ARK_ADD_PRO')

  if (config.dispose !== 0) {
    eventIDEle.setAttribute('disabled', 'disabled')
    eventIDEle.setAttribute('data-ark-tip', '已部署埋点不可修改事件ID')
    eventIDEle.setAttribute('data-ark-tip-pos', JSON.stringify({ left: '120px', pos: 'bottom' }))
  }
  if (tooltipObj.newVision !== true) {
    var msg = '此功能要求方舟平台版本在5.1及以上'
    addProEle.setAttribute('disabled', 'disabled')
    addProEle.parentNode.setAttribute('data-ark-tip', msg)
    addProEle.parentNode.setAttribute('data-ark-tip-pos', JSON.stringify({ left: '70px' }))
    document.getElementById('ARK_PRO_LIST').setAttribute('data-ark-tip', msg)
    document.getElementById('ARK_PRO_LIST').setAttribute('data-ark-tip-pos', JSON.stringify({ left: '70px' }))

    var list = [isPathEle, isListEle, isClassEle]
    for (var i = 0; i < list.length; i++) {
      var pathParentEle = list[i].parentNode.parentNode
      pathParentEle.className += ' v-radio-wrapper-disabled'
      pathParentEle.setAttribute('disabled', 'disabled')
      list[i].setAttribute('disabled', 'disabled')
    }
  }
  addProEle.onclick = addProItem
  var relatedsEles = document.getElementsByClassName('ARK_PRO_ITEM')
  for (var z = 0; z < relatedsEles.length; z++) {
    if (tooltipObj.newVision !== true) {
      var hoverBox = getChildEle(relatedsEles[z], 'ARK_FIXED_BOX')
      hoverBox.style.display = 'block'
    }
    (function (relatedEle, conf) {
      setRelatedsActive(relatedEle, conf)
    })(relatedsEles[z], config.related[z])
  }

  if (config.content === '') {
    isTextEle.parentNode.parentNode.style.display = 'none'
  }
  if (config.classes === '') {
    isClassEle.parentNode.parentNode.style.display = 'none'
  }
  if (config.newPath && JSON.stringify(config.newPath).indexOf('"row"') < 0) {
    isListEle.parentNode.parentNode.style.display = 'none'
  }
  var pageUlEle = isPageEle.nextSibling

  Util.addEvent(isPageEle, 'click', function () {
    pageUlEle.style.display = 'block'
    pageUlEle.style.left = '80px'
  })
  var isPageType = isPageEle.getAttribute('data-type')
  for (var y = 0; y < pageUlEle.childNodes.length; y++) {
    var pageLi = pageUlEle.childNodes[y]
    pageLi.className = (Util.paramType(pageLi.className) === 'String' ? pageLi.className : '').replace(/selected/g, '')
    var type = pageLi.getAttribute('data-type')
    if (isPageType === type) {
      pageLi.className += 'selected'
    }
    Util.addEvent(pageLi, 'click', (function (ele) {
      return function () {
        for (var z = 0; z < pageUlEle.childNodes.length; z++) {
          var liEle = pageUlEle.childNodes[z]
          liEle.className = (Util.paramType(liEle.className) === 'String' ? liEle.className : '').replace(/selected/g, '')
        }
        var type = ele.getAttribute('data-type')
        isPageEle.value = ele.innerText
        ele.className += 'selected'
        isPageEle.setAttribute('data-type', type)
        pageUlEle.style.display = 'none'
      }
    })(pageLi))
  }
  for (var c = 0; c < config.props_binding.length; c++) {
    var binding = config.props_binding[c]
    if (binding.prop_name === 'class') {
      isClassEle.setAttribute('checked', 'checked')
    } else if (binding.prop_name === 'text') {
      isTextEle.setAttribute('checked', 'checked')
    }
  }
  if (config.new_path) {
    isPathEle.setAttribute('checked', 'checked')
  }
  if (config.new_path && config.newPath && JSON.stringify(config.new_path).indexOf('"row"') < 0 && JSON.stringify(config.newPath).indexOf('"row"') > -1) {
    isListEle.setAttribute('checked', 'checked')
  }
  function eventBingsActive (e) {
    if (e) {
      isTextAndIsAllEleClick(e)
    }
    var pathParentEle = isPathEle.parentNode.parentNode
    if (isTextEle.getAttribute('checked') !== 'checked' && isClassEle.getAttribute('checked') !== 'checked' && isListEle.getAttribute('checked') !== 'checked' && isPathEle.getAttribute('checked') !== 'checked') {
      isTextAndIsAllEleClick({ target: isPathEle })
      config.new_path = config.newPath
    }
    var bindings = []
    if (isTextEle.getAttribute('checked') === 'checked') {
      bindings.push({
        "prop_name": "text",
        "prop_type": "string",
        "value": config.content
      })
    }
    if (isClassEle.getAttribute('checked') === 'checked') {
      bindings.push({
        "prop_name": "class",
        "prop_type": "string",
        "value": config.classes
      })
    }
    if (isListEle.getAttribute('checked') === 'checked') {
      config.new_path = delPathRow(config.newPath)
      if (isPathEle.getAttribute('checked') !== 'checked') {
        isTextAndIsAllEleClick({ target: isPathEle })
      }
      pathParentEle.className += ' v-radio-wrapper-disabled'
      pathParentEle.setAttribute('disabled', 'disabled')
      isPathEle.setAttribute('disabled', 'disabled')
    } else if (tooltipObj.newVision === true) {
      pathParentEle.className = pathParentEle.className.replace(/ v-radio-wrapper-disabled/g, '')
      pathParentEle.removeAttribute('disabled')
      isPathEle.removeAttribute('disabled')
      config.new_path = config.newPath
    }
    if (isPathEle.getAttribute('checked') !== 'checked') {
      config.new_path = null
    }
    config.props_binding = bindings
    changeBindings(config)
  }
  eventBingsActive()
  Util.addEvent([isPathEle, isListEle, isClassEle, isTextEle], 'click', eventBingsActive)
  eventIDEle.focus()
  if (Util.paramType(eventIDEle.createTextRange) !== 'Undefined') {
    var rtextRange = eventIDEle.createTextRange()
    rtextRange.moveStart('character', eventIDEle.value.length)
    rtextRange.collapse(true)
    rtextRange.select()
  } else if (Util.paramType(eventIDEle.selectionStart) !== 'Undefined') {
    eventIDEle.selectionStart = eventIDEle.value.length
  }
  eventNameEle.onblur = eventIDEle.onblur = inputOnblur
  Util.addEvent([eventNameEle, eventIDEle], 'focus', inputOnfocus)
  // eventNameEle.onfocus = eventIDEle.onfocus = inputOnfocus
  saveEle.onclick = function () {
    inputOnblur({
      target: eventIDEle
    })
    if ((eventIdErrorEle.style.display && eventIdErrorEle.style.display !== 'none') ||
      (eventNameErrorEle.style.display && eventNameErrorEle.style.display !== 'none')) {
      return
    }

    var eventName = eventNameEle.value || ''
    var eventID = eventIDEle.value || ''

    var relatedEles = document.getElementsByClassName('PROVALUE')
    var relatedTypeEles = document.getElementsByClassName('PROTYPE')
    var relatedKeyEles = document.getElementsByClassName('PROID')
    var relatedRegexEles = document.getElementsByClassName('PROREX')
    var relateds = []
    var properties = []
    for (var i = 0; i < relatedEles.length; i++) {
      var relatedEle = relatedEles[i]
      var typeEle = relatedTypeEles[i]
      var relatedKeyEle = relatedKeyEles[i]
      var relatedRegexEle = relatedRegexEles[i]
      var related = relatedEle.getAttribute('data-ark-related')
      var relatedType = typeEle.getAttribute('data-type')
      var relatedValue = relatedEle.value
      var relatedKey = relatedKeyEle.value
      var relatedTegex = relatedRegexEle.value
      if (related && relatedKey !== '') {
        related = JSON.parse(related)
        related['properties'] = [{
          key: relatedKey,
          prop_name: 'text',
          prop_type: relatedType,
        }]
        if (relatedTegex !== '') {
          related['properties'][0]['regex'] = Util.encode(relatedTegex)
        }

        delete related['target']['path']
        delete related['target']['newPath']
        relateds.push(related)
      } else if (relatedValue !== '' && relatedKey !== '') {
        properties.push({
          key: relatedKey,
          prop_name: 'text',
          prop_type: relatedType,
          value: relatedValue
        })
      }
    }
    config.related = relateds
    config.properties = properties

    // var isAll = isPageEle.getAttribute('checked') === 'checked' ? 0 : 1
    // var isText = isTextEle.getAttribute('checked') === 'checked' ? 1 : 0
    var isAll = isPageEle.getAttribute('data-type') === 'isAll' ? 1 : 0
    var isText = isTextEle.getAttribute('checked') === 'checked' ? 1 : 0
    config = Util.objMerge(config, {
      appEventId: eventID,
      appEventName: eventName,
      isAll: isAll,
      isText: isText === 1 ? config.content : ''
    })

    var isChange = config.isChange
    delete config.content
    delete config.isChange
    delete config.newPath
    delete config.classes
    delete config.bindings
    var obj = {
      type: isChange ? 'change_update' : 'change_request',
      payload: {
        path: [config]
      }
    }
    sendMsg(obj)
    delClickBox()
  }
  cancelEle.onclick = function () {
    delClickBox()
    showVisualEvent(visualEvetnList)
  }
  moveBox.init(headMove)
}
function clearDisposeEles () {
  var className = 'ARK_SHOW_DISPOSE'
  var hasSetEles = document.getElementsByClassName(className)
  // var delEles = []
  while (hasSetEles.length > 0) {
    var eventID = hasSetEles[0].getAttribute('data-ark-attr')
    if (eventID) {
      hasSetEles[0].className = hasSetEles[0].className.replace(/ ARK_SHOW_DISPOSE/g, '')
    } else {
      var parentEls = hasSetEles[0].parentNode || document.body
      parentEls.removeChild(hasSetEles[0])
    }
  }
}
var boxOption = {
  top: null,
  left: null
}
function delClickBox () {
  clearDisposeEles()
  clearShowDoms('ARK_SAVE_PRO')
  clearShowDoms('ARK_PRO_ELE')
  clearShowDoms('debugLog')

  var clickBoxElement = document.getElementById('ARK_BOX')
  if (clickBoxElement) {
    boxOption.left = clickBoxElement.style.left
    boxOption.top = clickBoxElement.style.top
    var boxParent = clickBoxElement.parentNode || document.body
    boxParent.removeChild(clickBoxElement)
  }
  var isEditEle = document.getElementById('ARK_IS_CLICK')
  if (isEditEle) {
    var editParent = isEditEle.parentNode || document.body
    editParent.removeChild(isEditEle)
  }
  var isBox = document.getElementById('ARK_SAVE_CLICK')
  if (isBox) {
    var isBoxParent = isBox.parentNode || document.body
    isBoxParent.removeChild(isBox)
  }
}

function clearShowDoms (className) {
  var hasSetEles = document.getElementsByClassName(className)
  while (hasSetEles.length > 0) {
    var parentEls = hasSetEles[0].parentNode || document.body
    parentEls.removeChild(hasSetEles[0])
  }

  isAddPro = false
}
function setShowDoms (ele) {
  var eventID = ele.getAttribute('data-ark-id')
  var eventEle = document.getElementById(eventID)
  if (eventEle) {
    eventEle.className += ' ARK_SHOW_DISPOSE'
  } else {
    var eleParent = ele.parentNode || document.body
    var diposeDiv = setOnceBox(ele, '', 'ARK_SHOW_DISPOSE')
    eleParent.appendChild(diposeDiv)
  }

}
function setVisualEvent (ele, config, isOpen) {

  ele.setAttribute('data-ark-attr', JSON.stringify(config))
  var eventPostion = setBoxPostion(ele)
  var width = eventPostion.width
  var height = eventPostion.height
  if (!width || !height) {
    return
  }

  if (Util.paramType(ele.className) === 'String' && ele.className.indexOf('ARK_') > -1) {
    ele.className = ele.className.replace(/ ARK_NO_LIGHT/g, '')
    return
  }
  var eventEleId = ele.getAttribute('data-ark-id')
  var disposeDiv = null
  if (eventEleId) {
    disposeDiv = document.getElementById(eventEleId)
  }
  if (!disposeDiv) {
    eventEleId = +new Date() + '' + Math.floor(Math.random() * 1000000)
    ele.setAttribute('data-ark-id', eventEleId)
    var eleParent = ele.parentNode || document.body
    disposeDiv = setOnceBox(ele, '', 'ARK_SAVE_DISPOSE')
    eleParent.appendChild(disposeDiv)
    // clearShowDoms('ARK_SAVE_DISPOSE')
    // Util.addEvent(disposeDiv, 'click', (function (ele) {
    //   return function (event) {
    //     event.stopPropagation()
    //     setEleMessage(ele)
    //     openVisualBox(disposeDiv)
    //     return false
    //   }
    // })(ele))
  } else {
    disposeDiv.style.left = eventPostion.x + 'px'
    disposeDiv.style.top = eventPostion.y + 'px'
    disposeDiv.style.width = eventPostion.width + 'px'
    disposeDiv.style.height = eventPostion.height + 'px'
  }
  disposeDiv.setAttribute('data-ark-attr', JSON.stringify(config))
  disposeDiv.id = eventEleId

  if (isOpen) {
    setEleMessage(ele)
    openVisualBox(disposeDiv)
  }
}

function removeVisualEvent (ele) {
  delClickBox()
  ele.removeAttribute('data-ark-attr')
  var eventID = ele.getAttribute('data-ark-id')
  if (eventID) {
    ele.removeAttribute('data-ark-id')
    ele.removeAttribute('data-ark-attr')
    var hoverEle = document.getElementById('ARK_CLICK')
    if (hoverEle) {
      var parentEle = hoverEle.parentNode || document.body
      parentEle.removeChild(hoverEle)
    }
    var eventEle = document.getElementById(eventID)
    if (eventEle) {
      var eventParentEle = eventEle.parentNode || document.body
      eventParentEle.removeChild(eventEle)
    }
  }
}
var elePath = null
var patt = /\d{13}/g;

// function checkChildrenEvent (ele) {
//   var eleAttr = ele.getAttribute('data-ark-attr')

//   if (!eleAttr && visualEvetnList.length > 0) {
//     showVisualEvent(visualEvetnList)
//   }

// }
function offset (curEle) {
  var totalLeft = null, totalTop = null, par = curEle;
  var eleTable = null
  //首先加自己本身的左偏移和上偏移
  // totalLeft += curEle.offsetLeft;
  // totalTop += curEle.offsetTop
  //只要没有找到body，我们就把父级参照物的边框和偏移也进行累加
  while (par) {
    if (par.tagName === 'TABLE') {
      eleTable = par
    }
    if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
      //累加父级参照物的边框
      totalLeft += par.clientLeft;
      totalTop += par.clientTop
    }
    //累加父级参照物本身的偏移
    totalLeft += par.offsetLeft;
    totalTop += par.offsetTop
    par = par.offsetParent;
  }

  return {
    left: totalLeft,
    top: totalTop,
    eleTable: eleTable
  }
}
var moveX = 0
var moveY = 0
var hiddenEle = []
function mouseMoveEvent (e) {

  var ele = e.target || e.srcElement
  if ((ele.id && (ele.id === 'ARK_PRO' || ele.id === 'ARK_SAVE_CLICK')) || (Util.paramType(ele.className) === 'String' && (ele.className.indexOf('ARK_SAVE_DISPOSE') > -1 || ele.className === 'ARK_SAVE_PRO') || ele.className === 'ARK_SHOW_DISPOSE')) {
    ele.style.display = 'none'

    hiddenEle.push(ele)
    return true
  }
  if (isParent(ele, document.getElementById('ARK_SAVE_CLICK'))) {
    document.getElementById('ARK_SAVE_CLICK').style.display = 'none'
    hiddenEle.push(document.getElementById('ARK_SAVE_CLICK'))
    return true
  }
  var tagName = ele.tagName

  if (isParent(ele, document.getElementById('ARK_BOX')) || isParent(ele, document.getElementById('ARK_DEBUG_BOX')) || ['html', 'body', 'hr', 'br', 'canvas', 'svg', 'use'].indexOf(tagName.toLowerCase()) > -1) {
    var clickEle = document.getElementById('ARK_CLICK')
    if (clickEle) {
      var parentClickEle = clickEle.parentNode || document.body
      parentClickEle.removeChild(clickEle)
    }
    return true
  }
  var moveEle = isAddPro === true ? proEleObj.ele : clickEleObj.ele
  eleDiv = isAddPro === true ? document.getElementById('ARK_PRO') : document.getElementById('ARK_CLICK')
  if (eleDiv && (Math.abs(e.clientX - moveX) > 2 || Math.abs(e.clientY - moveY) > 2)) {
    // if (eleDiv) {
    eleDiv.style.display = 'none'
  }

  if (ele !== eleDiv && moveEle !== ele) {
    var eleParent = ele.parentNode || document.body
    // var eleParent = document.body
    moveEle = ele
    setEleMessage(ele)
    if (debugModel !== true) {
      if (eleDiv) {
        var parentEle = eleDiv.parentNode || document.body
        // var parentEle = document.body
        parentEle.removeChild(eleDiv)
      }
      var eleDivTemp = isAddPro === true ? setOnceBox(moveEle, 'ARK_PRO', 'ARK_PRO_ELE') : setOnceBox(moveEle, 'ARK_CLICK', 'ARK_CLICK_ELE')
      eleParent.appendChild(eleDivTemp)
    }
    checkPoints()
  }

  clearTimeout(timer)
  timer = null
  timer = setTimeout(function () {
    if (!eleDiv) return
    eleDiv.style.display = 'block'
  }, 20)
}
function mouseOutEvent (e) {
  var ele = (e || window.event).target
  // if (ele.id && (ele.id === 'ARK_IS_CLICK'||)) {
  //   return
  // }
  if ((ele.id && ele.id === 'ARK_PRO') || (Util.paramType(ele.className) === 'String' && ele.className.indexOf('ARK_') > -1)) {
    return
  }
  // var proEles = document.getElementsByClassName('ARK_SAVE_PRO')
  for (var i = 0; i < hiddenEle.length; i++) {
    hiddenEle[i].style.display = 'block'
  }
  // var disposeEle = document.getElementsByClassName('ARK_SAVE_DISPOSE')
  // for (var y = 0; y < disposeEle.length; y++) {
  //   disposeEle[y].style.display = 'block'
  // }
  hiddenEle = []
}

  Util.addEvent(document, 'click', function (event) {
    var ele = (event || window.evnet).target
    var ulELes = document.getElementsByClassName('ARK_DROPDOWN')
    for (var i = 0; i < ulELes.length; i++) {
      ulELes[i].style.display = 'none'
    }
    if (highlightStatus === false || isParent(ele, document.getElementById('ARK_BOX'))) {
      return true
    }
    if (debugModel === true) {
      if (isParent(ele, document.getElementById('ARK_DEBUG_BOX')) === false) {
        event.stopPropagation()
        event.preventDefault()
        delDebugBox()
        sendDebugMsg()
        return false
      }
      return true
    }
    delDebugBox()
    if (isAddPro === true && proEleObj.ele) {
      event.stopPropagation()
      event.preventDefault()
      addProEleBox()
      return false
    }
    if (isParent(ele, document.getElementById('ARK_BOX')) === false) {
      event.stopPropagation()
      event.preventDefault()
      delClickBox()
      openVisualBox()
      return false
    }
    // if (isAddPro === true) {
    //   Util.addEvent(eleDivTemp, 'click', function () {
    //     event.stopPropagation()
    //     addProEleBox()
    //     return false
    //   })
    // } else if (debugModel === false) {
    //   Util.addEvent(eleDivTemp, 'click', function (event) {

    //   }, true)
    // }

  }, true)

function setBoxPostion (ele) {
  var eleOffsetParent = ele.offsetParent || document.body
  var mouseElePosition = offset(ele)
  var parentPostion = offset(eleOffsetParent)
  var y = mouseElePosition.top - parentPostion.top
  var x = mouseElePosition.left - parentPostion.left
  if (mouseElePosition.eleTable !== null) {
    parentPostion = offset(mouseElePosition.eleTable.offsetParent)
    x = mouseElePosition.left - parentPostion.left
    y = mouseElePosition.top - parentPostion.top
  }
  var width = ele.offsetWidth
  var height = ele.offsetHeight
  return {
    x: x - 1.5,
    y: y - 1.5,
    width: width,
    height: height
  }
}
function setOnceBox (ele, id, className) {
  var boxDiv = document.createElement('div')
  boxDiv.id = id
  boxDiv.className = className
  var eventPostion = setBoxPostion(ele)
  boxDiv.style.top = eventPostion.y + 'px'
  boxDiv.style.left = eventPostion.x + 'px'
  boxDiv.style.width = eventPostion.width + 'px'
  boxDiv.style.height = eventPostion.height + 'px'
  return boxDiv
}

var eleDiv = null
var timer = null
var clickEleObj = {}
var proEleObj = {}
function setEleMessage (ele) {
  var pathObj = domParentList(ele)
  var path = pathObj.path
  var index = setIndex(ele, pathObj.path)
  if (isAddPro === true) {
    proEleObj = {
      index: index,
      elePath: elePath,
      path: path,
      newPath: pathObj.newPath,
      ele: ele
    }
  } else {
    clickEleObj = {
      index: index,
      elePath: elePath,
      path: path,
      newPath: pathObj.newPath,
      ele: ele
    }
  }
}

function addVisualListener () {
  delClickBox()
  Util.addEvent(document, 'mousemove', mouseMoveEvent, true)
  Util.addEvent(document, 'mouseout', mouseOutEvent, true)
  // Util.addEvent(document, 'mouseover', showEleHover, true)
  var hoverEles = document.getElementsByClassName('ARK_SAVE_DISPOSE')
  for (var i = 0; i < hoverEles.length; i++) {
    hoverEles[i].className = hoverEles[i].className.replace(' ARK_NO_LIGHT', '')
  }
}
function delEvents () {
  var hoverEle = document.getElementById('ARK_CLICK')
  if (hoverEle) {
    var parentEle = hoverEle.parentNode || document.body
    parentEle.removeChild(hoverEle)
  }
  var hoverEles = document.getElementsByClassName('ARK_SAVE_DISPOSE')
  while (hoverEles.length > 0) {
    var hoverParentEle = hoverEles[0].parentNode || document.body
    hoverParentEle.removeChild(hoverEles[0])
  }
  var eventDivs = Util.selectorAllEleList('[data-ark-id]')
  for (var i = 0; i < eventDivs.length; i++) {
    eventDivs[i].removeAttribute('data-ark-id')
    eventDivs[i].removeAttribute('data-ark-attr')
  }
}
function removeVisualListener () {
  delClickBox()
  // Util.removeEvent(document, 'mouseover', showEleHover, true)
  Util.removeEvent(document, 'mousemove', mouseMoveEvent, true)
  var hoverEle = document.getElementById('ARK_CLICK')
  if (hoverEle) {
    var parentEle = hoverEle.parentNode || document.body
    parentEle.removeChild(hoverEle)
  }
  var hoverEles = document.getElementsByClassName('ARK_SAVE_DISPOSE')
  for (var i = 0; i < hoverEles.length; i++) {
    hoverEles[i].className += ' ARK_NO_LIGHT'
  }
}
var visualEvetnList = []
function checkPoints () {
  var ele = clickEleObj.ele
  var pageEvents = visualEvetnList
  var childrenList = ele.childNodes || []
  for (var i = 0; i < childrenList.length; i++) {
    for (var y = 0; y < pageEvents.length; y++) {
      var eventEleObj = pageEvents[y]
      if (checkNewPathBase(clickEleObj.newPath, eventEleObj.newPath) == true && pathContrast(clickEleObj, eventEleObj, true) === true) {
        setVisualEvent(ele, eventEleObj)
      }
    }
  }
}
function showVisualEvent (list) {
  delEvents()
  var localList = []
  var hash = window.location.hash
  if (hash.indexOf('?') > -1) {
    hash = hash.split('?')[0]
  }
  var url = window.location.protocol + '//' + window.location.host + window.location.pathname + hash
  var newEvent = []
  for (var i = 0; i < list.length; i++) {
    list[i]['inPage'] = false
    if (url === list[i].url || list[i].isAll === 1) {

      var eleShowPath = list[i].link
      var newPath = list[i].new_path
      var bindings = list[i].props_binding
      // var related = list[i].related
      if (!newPath && !bindings) {
        var index = list[i].index
        if (patt.test(eleShowPath) === true) {
          eleShowPath = eleShowPath.replace(patt, '')
        }
        var ele = parseEvent(eleShowPath)[index]
        if (ele) {
          setVisualEvent(ele, list[i])
          list[i]['inPage'] = true
        }
      } else {
        list[i].newPath = newPath
        newEvent.push(list[i])
      }
      localList.push(list[i])
    }
  }
  if (newEvent.length > 0) {
    var eles = parserPageEvents(newEvent)
    for (var y = 0; y < eles.length; y++) {
      setVisualEvent(eles[y].ele, eles[y].config)
    }
    for (var t = 0; t < list.length; t++) {
      for (var z = 0; z < newEvent.length; z++) {
        if (list[t].appEventId === newEvent[z].newEvent && list[t].inPage === false) {
          if (list[i].isAll === 1) {
            list[t].inPage = newEvent[z].inPage
          }
        }
      }
    }
  }
  visualEvetnList = localList

  return list
}

function delVisualEvent (obj) {
  var newPath = obj.new_path
  var bindings = obj.props_binding
  var ele = null
  var eles = []
  if (!newPath && !bindings) {
    var eleShowPath = obj.link
    var index = obj.index
    ele = parseEvent(eleShowPath)[index]
  } else {
    eles = parserPageEvents([obj])
  }
  if (ele) {
    removeVisualEvent(ele)
  }
  for (var i = 0; i < eles.length; i++) {
    removeVisualEvent(eles[i].ele)
  }
}
var highlightStatus = true
function hiddenVisualEvent (status) {
  delClickBox()
  // var eleList = Util.selectorAllEleList('[data-ark-attr]') // document.querySelectorAll('[data-ark-attr]')
  if (!status) {
    highlightStatus = false
    removeVisualListener()
    // var hoverEles = document.getElementsByClassName('ARK_SAVE_DISPOSE')
    // for (var i = 0; i < hoverEles.length; i++) {
    //   hoverEles[i].className += ' ARK_NO_LIGHT'
    // }
  } else {
    highlightStatus = true
    addVisualListener()
  }
  // for (var i = 0; i < eleList.length; i++) {
  //   var ele = eleList[i]
  //   if (status) {
  //     var eleAttr = ele.getAttribute('data-ark-attr')
  //     setVisualEvent(ele, JSON.parse(eleAttr))
  //   }
  // }
}

function openVisualEvent (obj) {
  var newPath = obj.new_path
  var bindings = obj.props_binding
  var ele = null
  obj.isPage = true
  if (!newPath && !bindings) {
    var eleShowPath = obj.link
    var index = obj.index
    ele = parseEvent(eleShowPath)[index]
  } else {
    var eles = parserPageEvents([obj])
    if (eles.length > 0) {
      ele = eles[0].ele
    }
  }
  if (ele) {
    setVisualEvent(ele, obj, true)
  }
}
var debugModel = false
function openDebugModule (status) {
  debugModel = status
}

/**
 * 清除当前展示的debug框
 */
function delDebugBox () {
  var ele = document.getElementById('ARK_DEBUG_BOX')
  if (ele) {
    var parent = ele.parentNode
    parent.removeChild(ele)
  }
}
function openDebugEvent (obj) {
  var ele = clickEleObj.ele
  var attrConfig = ele.getAttribute('data-ark-attr')
  attrConfig = JSON.parse(attrConfig)
  var relateds = attrConfig.related || []
  var properties = attrConfig.properties || []
  var elePosition = boxPosition(ele, 'debug')
  var config = {
    top: elePosition.top,
    left: elePosition.left,
    list: obj.event_info || [],
    newPath: domParentList(ele).newPath
  }
  if (relateds.length > 0) {
    for (var i = 0; i < relateds.length; i++) {
      var eRelated = Util.toDeep(relateds[i].target)
      eRelated['path'] = eRelated.h5_path
      if (eRelated.h5_path) {
        var relatedPath = backH5PathProPath(config.newPath, eRelated)
        var relatedEele = parseNewPath(relatedPath, eRelated.step, clickEleObj.ele)
        if (relatedEele) {
          var value = relatedEele ? getElementContent(relatedEele, true) : ''
          if (value !== '') {
            var rxegx = relateds[i].properties[0].regex
            if (rxegx) {
              try {
                rxegx = Util.decode(rxegx)
                // rexegValue = rexegValue.replace('\\', '\\\\')
                var _regex = new RegExp(rxegx)
                var regexVal = _regex.exec(value)//value.match(rexegValue)//
                if (regexVal && regexVal.length > 0) {
                  value = regexVal[0]
                }
              } catch (e) { }
            }
            config.list.push({
              title: relateds[i].properties[0].key,
              val: value
            })
          }
        }
      }

    }
  }
  for (var y = 0; y < properties.length; y++) {
    config.list.push({
      title: properties[y].key,
      val: properties[y].value
    })
  }

  var debugTemp = setDebugTemp(config)

  var debugDiv = document.createElement('div')
  debugDiv.innerHTML = debugTemp
  document.body.appendChild(debugDiv.childNodes[0])

  var cancelEle = document.getElementById('ARK_DEBUG_CHA')
  Util.addEvent(cancelEle, 'click', delDebugBox)

}

function sendDebugMsg () {

  var eventConfig = clickEleObj.ele.getAttribute('data-ark-attr')
  if (!eventConfig) return
  var eventId = JSON.parse(eventConfig).appEventId
  var hash = window.location.hash
  if (hash.indexOf('?') > -1) {
    hash = hash.split('?')[0]
  }
  var url = window.location.protocol + '//' + window.location.host + window.location.pathname + hash
  var config = {
    event_info: {
      $event_id: eventId,
      $lib_version: $lib_version,
      $screen_width: window.screen.width,
      $screen_height: window.screen.height
    },
    type: 'debug',
    target_page: url
  }
  sendMsg(config)
}

// 设置文字提示
function delTipEle () {
  var ele = document.getElementById('ARKTOOLTIP')
  if (ele) {
    var parentEle = ele.parentNode || document.body
    parentEle.removeChild(ele)
    tooltipObj.ele = null
  }
}
var tooltipObj = {}
var hiddenTipTimer = null

Util.addEvent(document, 'mouseover', function (e) {
  clearTimeout(hiddenTipTimer)
  var ele = (e || window.event).target

  var attr = ele.getAttribute('data-ark-tip')
  var attrPostion = ele.getAttribute('data-ark-tip-pos') || {}
  if (Util.paramType(attrPostion) === 'String') {
    attrPostion = attrPostion.replace(/'/g, '"')
    attrPostion = JSON.parse(attrPostion)
  }
  if (attr) {
    tooltipObj.ele = ele

    delTipEle()
    try {
      attr = JSON.parse(attr)
    } catch (e) { }
    var msg = ''
    var classPostion = 'ARKTOP'
    if (Util.paramType(attr) === 'String') {
      msg = attr
    }
    if (Util.paramType(attr) === 'Object' || Util.paramType(attrPostion) === 'Object') {
      msg = attr.msg || msg
      if (attr['pos'] === 'right' || attrPostion['pos'] === 'right') {
        classPostion = 'ARKRIGHT'
      }
      if (attr['pos'] === 'bottom' || attrPostion['pos'] === 'bottom') {
        classPostion = 'ARKBOTTOM'
      }
    }
    delTipEle(e)
    var tipDiv = setOnceBox(ele, 'ARKTOOLTIP', 'ARKTOOLTIP')
    if (classPostion === 'ARKBOTTOM') {
      tipDiv.style.bottom = '-44px'
      tipDiv.style.top = 'unset'
    } else {
      tipDiv.style.top = ele.offsetTop - 44 + 'px'
    }

    if (attrPostion['left']) {
      tipDiv.style.left = attrPostion['left']
    }
    if (attrPostion['top']) {
      tipDiv.style.top = attrPostion['top']
    }
    tipDiv.style.width = 'auto'
    tipDiv.style.height = 'auto'
    tipDiv.innerHTML = '<div div class="ARROW ' + classPostion + '" ></div ><span class="WORDS">' + msg + '</span>'
    ele.parentNode.appendChild(tipDiv)
  } else {
    hiddenTipTimer = setTimeout(function () {
      if (isParent(ele, tooltipObj.ele) === false && isParent(ele, document.getElementById('ARKTOOLTIP')) === false) {
        delTipEle()
      }
    }, 200)
  }
})

function setVisualStatus (status) {
  tooltipObj['newVision'] = status
}

export { addVisualListener, removeVisualListener, showVisualEvent, delVisualEvent, hiddenVisualEvent, openVisualEvent, setVisualEvent, backProInputList, openDebugModule, openDebugEvent, setVisualStatus, delEvents }
