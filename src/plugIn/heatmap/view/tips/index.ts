import { createElement } from '../../utils/index'
import { heatConfig } from '../../store/index'

const html = `
<div class="ark-nodata-box">
    <div class="ark-nodata-img"></div>
    <div class="ark-nodata-text"></div>
</div>
`

export default function () {
  createElement('div', {
    id: 'arkHeadmapNodata',
    class: 'ark-headmap-nodata',
    content: html
  }, document.getElementById('arkHeadmapBody'))
}

// 显示或隐藏
export function nodataDisply(nodataText?: string) {
  const nodata = document.getElementById('arkHeadmapNodata')
  nodata.style.display = heatConfig.nodata ? 'block' : 'none'
  setNodataText(nodataText)
}

// 设置文案
export function setNodataText (text) {
  document.getElementById('arkHeadmapNodata').querySelector('.ark-nodata-text').innerHTML = text || ''
}