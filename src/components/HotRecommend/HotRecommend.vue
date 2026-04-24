<template>
  <section class="hot-recommend">
    <div class="section-header">
      <div class="title-group">
        <h2 class="section-title">热门推荐</h2>
        <span class="page-indicator">{{ currentPage + 1 }}/3</span>
      </div>
      <div class="nav-controls">
        <button class="nav-btn prev" @click="prevPage" :disabled="currentPage === 0">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <button class="nav-btn next" @click="nextPage" :disabled="currentPage === 2">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
        <button class="more-btn">查看更多</button>
      </div>
    </div>
    <div class="carousel-container">
      <div 
        class="carousel-track" 
        :style="{ transform: `translateX(-${currentPage * 100}%)` }"
      >
        <div v-for="page in 3" :key="page" class="carousel-page">
          <div class="book-grid">
            <BookCard 
              v-for="(book, index) in getBooksForPage(page - 1)" 
              :key="book.id"
              :book="book"
              :show-description="true"
              :rank="(page - 1) * 9 + index + 1"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="pagination-dots">
      <span 
        v-for="i in 3" 
        :key="i" 
        :class="['dot', { active: currentPage === i - 1 }]"
        @click="currentPage = i - 1"
      ></span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BookCard from '../BookCard/BookCard.vue';
import { mockBooks } from '../../mocks/books';
import './HotRecommend.css';

const currentPage = ref(0);

const getBooksForPage = (pageIndex: number) => {
  return mockBooks.slice(pageIndex * 9, (pageIndex + 1) * 9);
};

const nextPage = () => {
  if (currentPage.value < 2) {
    currentPage.value++;
  } else {
    currentPage.value = 0; // Loop back
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  } else {
    currentPage.value = 2; // Loop back
  }
};
</script>
