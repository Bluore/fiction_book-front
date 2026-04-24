<template>
  <div class="book-card">
    <div class="book-cover-wrapper">
      <img :src="cover" :alt="title" class="book-cover" />
      <div class="scan-line"></div>
    </div>
    <div class="book-info">
      <h3 class="book-title">{{ title }}</h3>
      <p class="book-author">{{ author }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import './BookCard.css';

defineProps<{
  cover: string;
  title: string;
  author: string;
}>();
</script>
