<template>
  <div class="Carouse-comp">
    <n-carousel autoplay :interval="3000" show-arrow>
     <img v-for="(img, index) in carouselImages" :key="index" class="carousel-img" :src="img">
    </n-carousel>
  </div>
</template>

<script setup lang="ts">
import './Carouse.css'

const carouselImages = [
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg'
]
</script>

<style scoped>
.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}
</style>