<template>
  <div class="home-recent">
    <section class="paper-section">
      <div class="section-header">
        <h2 class="section-title">最近在读</h2>
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
  </div>
</template>

<script setup lang="ts">
import PaperBookCard from './PaperBookCard.vue';
import { mockBooks } from '@/mocks/books';

const recentBooks = mockBooks.slice(0, 8);
</script>
