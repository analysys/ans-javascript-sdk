<template>
  <div>
    <n-carousel show-arrow>
      <img
        class="carousel-img"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
      >
      <img
        class="carousel-img"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
      >
      <img
        class="carousel-img"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
      >
      <img
        class="carousel-img"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
      >
    </n-carousel>
    <div style="height:10px"></div>
    <n-grid x-gap="12" :cols="4">
      <n-gi>
        <div class="light-green">
          更快
        </div>
      </n-gi>
      <n-gi>
        <div class="green" id="gridGreen">更好</div>
      </n-gi>
      <n-gi>
        <div class="light-green" >更准</div>
      </n-gi>
      <n-gi>
        <div class="green" id="gridGreen2">更高</div>
      </n-gi>
    </n-grid>
    <div style="height:10px"></div>
    <n-list hoverable clickable>

      <n-list-item>
        <n-thing title="相见恨晚" content-style="margin-top: 10px;">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="info" size="small">
                暑夜
              </n-tag>
              <n-tag :bordered="false" type="info" size="small">
                晚春
              </n-tag>
            </n-space>
          </template>
          
          奋勇呀然后休息呀<br>
          完成你伟大的人生
        </n-thing>
        <template #suffix>
          <n-button type="primary">查看详情</n-button>
        </template>
      </n-list-item>
  
      <n-list-item v-for="item in 5" :key="item">
        <n-thing title="他在时间门外" content-style="margin-top: 10px;">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="info" size="small">
                环形公路
              </n-tag>
              <n-tag :bordered="false" type="info" size="small">
                潜水艇司机
              </n-tag>
            </n-space>
          </template>
          最新的打印机<br>
          复制着彩色傀儡<br>
          早上好我的罐头先生<br>
          让他带你去被工厂敲击
        </n-thing>
        <template #suffix>
          <n-button type="primary" data-ark-exposure>查看详情</n-button>
        </template>
      </n-list-item>
 
    </n-list>
  </div>
</template>

<script setup lang="ts">
  import { NButton, NCarousel, NGrid, NGi, NList, NTag, NListItem, NSpace, NThing, NRow, NCol  } from 'naive-ui'
</script>

<style scoped>
.carousel-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
.light-green {
  height: 128px;
  text-align: center;
  line-height: 128px;
  font-size: 16px;
  background-color: rgba(0, 128, 0, 0.12);
}
.green {
  height: 128px;
  text-align: center;
  line-height: 128px;
  font-size: 16px;
  background-color: rgba(0, 128, 0, 0.24);
}
</style>