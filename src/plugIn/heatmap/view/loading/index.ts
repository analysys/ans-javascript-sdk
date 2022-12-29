import './index.scss'
import { createElement } from '../../utils/index'
import { heatConfig } from '../../store/index'

const html = `
<div class="ark-loading-box">
    <div class="ark-loading-img"></div>
    <div class="ark-loading-text">生成热图中…</div>
</div>
`

export default function () {
  createElement('div', {
    id: 'arkHeadmapLoading',
    class: 'ark-headmap-loading',
    content: html
  }, document.getElementById('arkHeadmapBody'))
}

// 显示或隐藏
export function loadingDisply() {
  const loading = document.getElementById('arkHeadmapLoading')
  loading.style.display = heatConfig.loading ? 'block' : 'none'
}