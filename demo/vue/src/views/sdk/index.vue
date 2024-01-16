<template>
  <div style="padding-top:10px">
    
        <n-card title="用户信息">
          <n-button type="primary" block @click="getDistinctId()">获取匿名id</n-button>
          <div style="padding-top:10px">
            <n-input-group>
              <n-input v-model:value="state.anonymousId" placeholder="设置匿名id"/>
              <n-button type="primary" @click="setDistinctId">设置匿名id</n-button>
            </n-input-group>
          </div>

          <div style="padding-top:10px">
            <n-input-group>
              <n-input v-model:value="state.aliasId" placeholder="设置关联id"/>
              <n-button type="primary" @click="alias">用户关联</n-button>
            </n-input-group>
          </div>
        </n-card>
    
        <n-card title="自定义事件上报">
          <n-button type="primary" block @click="track()">上报自定义事件</n-button>
        </n-card>

        <n-card title="手动上报pagview">
          <n-button type="primary" block @click="pageView()">上报pagview</n-button>
        </n-card>

        <n-card title="通用属性">
          <n-button type="primary" block @click="registerSuperProperty">设置单个通用属性</n-button>
          <div style="padding-top:10px">
            <n-button type="primary" block @click="registerSuperProperties">设置多个通用属性</n-button>
          </div>
          <div style="padding-top:10px">
            <n-button type="primary" block @click="unRegisterSuperProperty">删除单个通用属性</n-button>
          </div>
          <div style="padding-top:10px">
            <n-button type="primary" block @click="clearSuperProperties">删除所有通用属性</n-button>
          </div>

          <div style="padding-top:10px">
            <n-button type="primary" block @click="getSuperProperties">获取所有通用属性</n-button>
          </div>
          <div style="padding-top:10px">
            <n-input v-model:value="state.superPropertiesKey" placeholder="属性key"/>
            <n-button type="primary" block @click="getSuperProperty">获取单个通用属性</n-button>
          </div>
        </n-card>

        <n-card title="卡片">
          <div>
            <div style="height:10px"></div>
            <div style="height:10px"></div>
            <input />
          </div>
        </n-card>

  </div>
</template>

<script setup lang="ts">
  import { NButton, NCarousel, NGrid, NGi, NList, NTag, NListItem, NSpace, NThing, NRow, NCol, NCard, NInput, NInputGroup  } from 'naive-ui'
  import { ref, reactive } from 'vue';
  
  // const message = useMessage()

  // window.AnalysysAgent.pageView('dsdfasf')

  // 开始记录时长
  window.AnalysysAgent.timeEvent('resource_expose')

  const state = reactive({
    anonymousId: '',
    aliasId: '',  
    customEvents: {
      name: '',
      attrs: {

      }
    },
    superPropertiesKey: 'testSuper'
  })
  
  // 获取匿名id
  const getDistinctId = function () {
    window.AnalysysAgent.getDistinctId((id) => {
      alert(id)
    })
  }
  // 设置匿名id
  const setDistinctId = function () {
    window.AnalysysAgent.identify(state.anonymousId)
  }
  // 用户关联
  const alias = function () {
    window.AnalysysAgent.alias(state.aliasId, () => {
      console.log('dddd')
    })
  }

  // 自定义事件上报
  const track = function () {
    // window.AnalysysAgent.registerSuperProperty('bbb', '123')
    const res = window.AnalysysAgent.track('buy', {
      has_picture: true
    })
    console.log(res)
  }

  const pageView = function () {
    window.AnalysysAgent.pageView('测试')
  }

  // 设置单个通用属性
  const registerSuperProperty = function () {
   window.AnalysysAgent.registerSuperProperty('author', 'hry', (res) => {
      console.log(res)
    })
  }

  // 设置多个通用属性
  const registerSuperProperties = function () {
    window.AnalysysAgent.registerSuperProperties({
      "testSuper": "addd"
    }, (res) => {
      console.log(res)
    })
  }

  // 设置单个通用属性
  const unRegisterSuperProperty = function () {
    window.AnalysysAgent.unRegisterSuperProperty('testSuper', (res) => {
      console.log(res)
    })
  }

  // 设置所有通用属性
  const clearSuperProperties = function () {
    window.AnalysysAgent.clearSuperProperties((res) => {
      console.log(res)
    })
  }

  // 获取所有通用属性
  const getSuperProperties = function () {
    window.AnalysysAgent.getSuperProperties((res) => {
      console.log(res)
    })
  }

  const getSuperProperty = function () {
    window.AnalysysAgent.getSuperProperty(state.superPropertiesKey, (res) => {
      console.log(res)
    })
  }
  

</script>