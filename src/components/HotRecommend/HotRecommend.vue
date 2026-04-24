<template>
  <section class="hot-recommend">
    <div class="section-header">
      <h2 class="section-title">热门推荐</h2>
      <button class="more-btn">查看更多</button>
    </div>
    <div class="book-grid">
      <BookCard 
        v-for="i in 5" 
        :key="i"
        cover="https://picsum.photos/368/460"
        :title="'热门小说 ' + i"
        author="佚名"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import BookCard from '../BookCard/BookCard.vue';
import './HotRecommend.css';
</script>
