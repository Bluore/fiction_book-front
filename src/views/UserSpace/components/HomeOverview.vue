<template>
  <div class="home-overview">
    <!-- 最近在读 -->
    <section class="paper-section">
      <div class="section-header">
        <h2 class="section-title">最近在读</h2>
        <span class="more-link">查看全部</span>
      </div>
      <div class="book-grid">
        <PaperBookCard 
          v-for="book in recentBooks" 
          :key="book.id"
          :title="book.name"
          :cover-image="book.cover_image"
        />
      </div>
    </section>

    <!-- 最近购买 -->
    <section class="paper-section">
      <div class="section-header">
        <h2 class="section-title">最近购买</h2>
        <span class="more-link">查看全部</span>
      </div>
      <div class="book-grid">
        <PaperBookCard 
          v-for="book in purchasedBooks" 
          :key="book.id"
          :title="book.name"
          :cover-image="book.cover_image"
        />
      </div>
    </section>

    <!-- 最近加入书架 -->
    <section class="paper-section">
      <div class="section-header">
        <h2 class="section-title">我的书架</h2>
        <span class="more-link">查看全部</span>
      </div>
      <div class="book-grid">
        <PaperBookCard 
          v-for="book in bookshelfBooks" 
          :key="book.id"
          :title="book.name"
          :cover-image="book.cover_image"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PaperBookCard from './PaperBookCard.vue';
import { mockBooks } from '@/mocks/books';

const recentBooks = computed(() => mockBooks.slice(0, 3));
const purchasedBooks = computed(() => mockBooks.slice(3, 6));
const bookshelfBooks = computed(() => mockBooks.slice(6, 9));
</script>

<style scoped>
/* Scoped styles can be minimal as they use classes from Home.css */
</style>
