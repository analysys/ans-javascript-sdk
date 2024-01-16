import './index.scss'
import { createElement } from '../../utils/index'
import { heatConfig, displayConfig } from '../../store/index'
import { setHeatMapConfig, heatmap } from '../heatmap/index'
import { arkcontentText } from '../../store/arkContent'

const html = `
  <div class="ark-heatmap-head-menu">
    <div class="ark-heatmap-head-menu-item" id="arkNavLocation" event-agent="click" heat-type="location" controller-name="heatmapTab">
      <i class="ark-icon ark-icon-point"></i>
      <span>点击位置热图</span>
    </div>
    <div class="ark-heatmap-head-menu-item" id="arkNavElement" event-agent="click" heat-type="element" controller-name="heatmapTab">
      <i class="ark-icon ark-icon-ele"></i>
      <span>点击元素热图</span>
    </div>
    <div class="ark-heatmap-head-menu-item" id="arkNavLines" event-agent="click" heat-type="lines" controller-name="heatmapTab">
      <i class="ark-icon ark-icon-dep"></i>
      <span>浏览深度线</span>
    </div>
  </div>

  <div class="ark-heatmap-head-handle">
    <div class="ark-heatmap-head-handle-item" id="arkHotEleList">
      <div class="ark-handle-hover"><i class="ark-icon ark-icon-element"></i>热门元素列表</div>
      <div class="ark-pop-box ark-element-list">
        <div class="ark-element-list-hd">热门点击元素</div>
        <table class="ark-element-list-bd">
          <thead>
            <tr>
              <td width="120">元素内容</td>
              <td>元素类型</td>
              <td>用户数</td>
              <td>点击次数</td>
              <td>点击次数占比</td>
            </tr>
          </thead>
          <tbody id="arkElementList">

          </tbody>
        </table>
      </div>
    </div>
    <div class="ark-heatmap-head-handle-item" id="arkConditionList">
      <div class="ark-handle-hover"><i class="ark-icon ark-icon-content"></i>过滤条件</div>
      <div class="ark-pop-box ark-filter-condition">
        <div class="ark-filter-condition-title">分析用户群</div>
        <div class="ark-filter-condition-crowd">
          <i class="ark-icon ark-icon-crowd"></i> <span></span>
        </div>
        <div class="ark-filter-condition-title">过滤条件</div>
        <div class="ark-filter-condition-attrs">
        </div>
      </div>
    </div>
    <div class="ark-heatmap-head-handle-item" id="arkHeatDisplayConfig">
      <div class="ark-handle-hover"><i class="ark-icon ark-icon-set"></i>显示设置</div>
      <div class="ark-pop-box ark-display-set">
        <div class="ark-display-set-item" >
          <div class="ark-display-set-item-name" style="top:3px">显示浏览深度线</div>
          <div class="ark-display-set-item-content">
            <span class="ark-heatmap-switch" id="arkDisplayDepth" event-agent="click" controller-name="displayDepth"></span>
          </div>
        </div>
        <div class="ark-display-set-item" id="arkSetColorRange" style="padding-top:20px;">
          <div class="ark-display-set-item-name">调整颜色范围</div>
          <div class="ark-display-set-item-content" style="padding-top:3px">
            <div class="ark-color-slider-box" id="arkColors">
              <div class="ark-slider-trigger ark-left-trigger"></div>
              <div class="ark-slider-trigger ark-right-trigger"></div>
              <div class="ark-color-left-track"></div>
              <div class="ark-color-middle-track"></div>
              <div class="ark-color-right-track"></div>
            </div>
          </div>
        </div>
        <div class="ark-display-set-item" id="arkSetOpacity" style="padding-top:20px">
          <div class="ark-display-set-item-name">调整背景透明度</div>
          <div class="ark-display-set-item-content" style="padding-top:3px">
            <div class="ark-slider-box" id="arkOpacitySlider">
              <div class="ark-slider-rate"></div>
              <div class="ark-slider-trigger"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ark-heatmap-head-handle-item" id="arkHeatmapSwitch">
      <span class="ark-heatmap-switch" event-agent="click" controller-name="heatmapSwitch"></span>热图显示
    </div>
    <div class="ark-heatmap-head-handle-item">
      <div class="ark-icon-box" event-agent="click" controller-name="refresh">
        <i class="ark-icon ark-icon-refresh"></i>
        <div class="ark-pop-tips">刷新</div>
      </div>
    </div>
    <div class="ark-heatmap-head-handle-item">
      <div class="ark-icon-box">
        <i class="ark-icon ark-icon-help"></i>
        <div class="ark-pop-tips">帮助</div>
      </div>
    </div>
    <div class="ark-heatmap-head-handle-item">
      <div class="ark-icon-box" event-agent="click" controller-name="navOpen">
        <i class="ark-icon ark-icon-down"></i>
        <div class="ark-pop-tips">收起</div>
      </div>
    </div>
  </div>
  <span class="ark-head-hide" event-agent="click" controller-name="navOpen">
    <i class="ark-icon ark-icon-down"></i>
  </span>
`
export default function () {
  createElement('div', {
    id: 'arkHeatmapHead',
    class: 'ark-heatmap-head',
    content: html
  }, document.getElementById('arkHeadmapBody'))

  setSelected()
  heatSwitch()
  toolDisplay()
  opacitySlider()
  renderCondition()
  colorSlider()
}

const eleMap = {
  location: 'arkNavLocation',
  element: 'arkNavElement',
  lines: 'arkNavLines'
}

// 清空当前选中的菜单
export function emptySelected () {
  const ele = document.getElementById(eleMap[heatConfig.heatMapType])
  ele.className = 'ark-heatmap-head-menu-item'
}

// 选中当前type
export function setSelected () {
  const ele = document.getElementById(eleMap[heatConfig.heatMapType])
  ele.className = 'ark-heatmap-head-menu-item ark-active'
}

// 热图开关
export function heatSwitch () {
  const state = heatConfig.heatMapShow
  document.getElementById('arkHeatmapSwitch').querySelector('.ark-heatmap-switch').className = state ? 'ark-heatmap-switch ark-switch-act' : 'ark-heatmap-switch'
}

export function displayDepth () {
  const state = displayConfig.lineShow
  document.getElementById('arkDisplayDepth').className = state ? 'ark-heatmap-switch ark-switch-act' : 'ark-heatmap-switch'
}

// nav open or hide
export function navOpen () {
  document.getElementById('arkHeatmapHead').style.top = heatConfig.isOpen ? '0px' : '-64px'
  document.querySelector('.ark-head-hide').style.display = heatConfig.isOpen ? 'none' : 'block'
}

// 工具栏显示与隐藏
export function toolDisplay () {
  const element = document.getElementById('arkHotEleList')
  element.style.display = heatConfig.heatMapType === 'element' ? 'block' : 'none'
  
  const arkHeatmapSwitch = document.getElementById('arkHeatmapSwitch')
  const arkHeatDisplayConfig = document.getElementById('arkHeatDisplayConfig')
  
  if (heatConfig.heatMapType !== 'lines') {
    arkHeatmapSwitch.style.display = 'block'
    arkHeatDisplayConfig.style.display = 'block'
  } else {
    arkHeatmapSwitch.style.display = 'none'
    arkHeatDisplayConfig.style.display = 'none'
  }

  if (heatConfig.heatMapType === 'location') {
    document.getElementById('arkSetColorRange').style.display = 'block'
    document.getElementById('arkSetOpacity').style.display = 'block'
  } else {
    document.getElementById('arkSetColorRange').style.display = 'none'
    document.getElementById('arkSetOpacity').style.display = 'none'
  }
}

// 条件列表渲染
export function renderCondition () {
  document.querySelector('.ark-filter-condition-crowd span').innerHTML = arkcontentText.crowds

  // ark-filter-condition-attrs
  let items = ''
  const conditions = arkcontentText.filter.conditions
  if (conditions.length) {
    conditions.forEach(o => {
      items += `<div class="ark-condigton-item">${o}</div>`
    })
    if (conditions.length > 1) {
      items += `<span class="ark-condigton-relation">${arkcontentText.filter.relation}</span>`
    }
  }
  else {
    items = '<div class="ark-condigton-item">无<div>'
  }
  document.querySelector('.ark-filter-condition-attrs').innerHTML = items
}

export function renderElementList (elementList) {
  const arkElementList = document.getElementById('arkElementList')
  if (arkElementList) {
    let trs = ''
    if (elementList && elementList.length) {
      elementList.forEach(o => {
        trs += `
            <tr>
              <td><div class="ark-element-content">${o.content || '-'}</div></td>
              <td>${o.type}</td>
              <td>${o.uv}</td>
              <td>${o.clickNum}</td>
              <td>${(o.clickNumPercent * 100).toFixed(2)}%</td>
            </tr>
        `
      })
    }
    arkElementList.innerHTML = trs
  }
}

// 滑块
function slider (el, options) {
  this.downX = null
  this.moveX = null
  this.max = options.max
  this.min = options.min
  const self = this
  el.addEventListener('mousedown', function(e) {
    self.downX = e.clientX
    const width = options.trackEl.offsetWidth - 10
    const left = el.offsetLeft
    function move (event) {
      if (self.downX) {
        self.moveX = left + (event.clientX - self.downX)
        const max = self.max || width
        const min = self.min || 0
        if (self.moveX > max) {
          self.moveX = max
        }
        if (self.moveX < min) {
          self.moveX = min
        }
        options && options.onMove(self.moveX, width)
        el.style.left = self.moveX + 'px'
      }
    }
    function up () {
      self.downX = null
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      options && options.onUp(self.moveX, width)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  })
}

// 透明度滑块
function opacitySlider () {
  const arkOpacitySlider = document.getElementById('arkOpacitySlider')
  new slider(arkOpacitySlider.querySelector('.ark-slider-trigger'), {
    trackEl: arkOpacitySlider,
    onMove: function (v) {
      arkOpacitySlider.querySelector('.ark-slider-rate').style.width = v + 'px'
    },
    onUp: function (v, width) {
      displayConfig.backgroundTransparent = v / width
      setHeatMapConfig()
    }
  })
}

// 颜色滑块
function colorSlider () {
  const arkOpacitySlider = document.getElementById('arkColors')
  const leftSlider = new slider(arkOpacitySlider.querySelector('.ark-left-trigger'), {
    trackEl: arkOpacitySlider,
    onMove: function (v) {
      rightSlider.min = v + 10
      arkOpacitySlider.querySelector('.ark-color-middle-track').style.left = v + 'px'
      arkOpacitySlider.querySelector('.ark-color-left-track').style.width = v + 'px'
    },
    onUp: function (v, width) {
      displayConfig.min = (v / width) * 100

      setHeatMapConfig()
    }
  })

  const rightSlider = new slider(arkOpacitySlider.querySelector('.ark-right-trigger'), {
    trackEl: arkOpacitySlider,
    onMove: function (v, width) {
      leftSlider.max = v - 10
      const w = width - v
      arkOpacitySlider.querySelector('.ark-color-middle-track').style.right = w + 'px'
      arkOpacitySlider.querySelector('.ark-color-right-track').style.width = w + 'px'
    },
    onUp: function (v, width) {
      displayConfig.max = (v / width) * 100
      setHeatMapConfig()
    }
  })
}
