<template>
  <div class="home-bookshelf">
    <section class="paper-section">
      <div class="section-header">
        <h2 class="section-title">我的书架</h2>
      </div>
      <div class="book-grid">
        <PaperBookCard 
          v-for="book in allBooks" 
          :key="book.id"
          :id="book.id"
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

const allBooks = mockBooks;
</script>
