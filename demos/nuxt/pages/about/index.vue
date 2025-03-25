<template>
  <section>
    <p>This page will be displayed at the /about route.</p>
    <div v-if="data">{{ data.hello }}</div>
  </section>
</template>


<script setup>
useSeoMeta({
  title: 'about',
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})

// const { data } = await useLazyFetch('/api/test')

// console.log(data)

const { data } = await useAsyncData(
  'test',
  () => $fetch('/api/test'), {
    lazy: true
  }
)

</script>