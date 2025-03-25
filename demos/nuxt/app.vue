<template>
  
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import AnalysysAgent from './public/sdk/5.0.7/AnalysysAgent_JS_SDK.es6.min.js';

AnalysysAgent.init({
  appkey: "ecommercedemo", //APPKEY
  uploadURL: 'https://event-ubademo-portal.jiguang.cn',
  debugMode: 2,
})

</script>