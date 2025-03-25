<template>
  <div>
    <h1>{{msg}}</h1>
    
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'index',
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})

const msg = ref('首页1')


</script>
