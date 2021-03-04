import Util from '../../../../../lib/common/index.js'

function bindHeadToggle () {
  var arkHead = document.getElementById('ARK_HEATMAP_HEAD')
  var openHead = document.getElementById('ARK_OPEN')
  var closeHead = document.getElementById('ARK_CLOSE')

  function toggleHead () {
    // event.stopPropagation();
    arkHead.style.top = Math.abs(arkHead.offsetTop) - arkHead.clientHeight + 'px'
    if (openHead.style.display === 'block') {
      openHead.style.display = 'none'
    } else {
      openHead.style.display = 'block'
    }
  }
  Util.addEvent(openHead, 'click', toggleHead)
  Util.addEvent(closeHead, 'click', toggleHead)
}

function initHead () {
  // 绑定头部显示隐藏
  bindHeadToggle()
}

export { initHead }
