<template>
  <div class="paper-book-cover" :style="containerStyle">
    <div class="cover-image-container">
      <img :src="coverImage" :alt="title" class="cover-image" />
      <div class="scan-effect"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  coverImage: string;
  title?: string;
  width?: number;
  height?: number;
}>();

const containerStyle = computed(() => ({
  width: `${props.width || 368}px`,
  height: `${props.height || 460}px`,
}));
</script>

<style scoped src="./PaperBookCover.css"></style>
