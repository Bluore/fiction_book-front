<template>
  <div class="book-card" :class="{ 'has-rank': rank }" @click="handleNavigate">
    <div class="book-cover-wrapper" :class="{ 'is-loading': !isLoaded && !isError }">
      <img 
        v-show="isLoaded"
        :src="book.cover_image" 
        :alt="book.name" 
        class="book-cover" 
        @load="handleLoad"
        @error="handleError"
      />
      <!-- 加载失败占位 -->
      <div v-if="isError" class="error-placeholder">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c0 1.1-.9 2-2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      </div>
      <!-- 扫描线：仅在加载中显示无限循环动画，加载完成后仅在悬停时显示单次动画 -->
      <div class="scan-line" :class="{ 'infinite-scan': !isLoaded && !isError }"></div>
      <div v-if="book.vip_level" class="vip-tag">{{ book.vip_level.toUpperCase() }}</div>
      <div v-if="rank" class="rank-badge" :class="'rank-' + rank">{{ rank }}</div>
    </div>
    <div class="book-info">
      <h3 class="book-title">{{ book.name }}</h3>
      <p class="book-description" v-if="showDescription">{{ book.description }}</p>
      <div class="book-meta">
        <span class="book-price" v-if="book.price">￥{{ (book.price / 100).toFixed(2) }}</span>
        <span class="book-stats">
          <svg class="icon-eye" viewBox="0 0 24 24" width="12" height="12">
            <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          {{ formatAmount(book.browse_amount) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { BookMetadata } from '../../mocks/books';
import './BookCard.css';

const router = useRouter();
const props = withDefaults(defineProps<{
  book: BookMetadata;
  showDescription?: boolean;
  rank?: number;
}>(), {
  showDescription: false
});

const isLoaded = ref(false);
const isError = ref(false);

const handleNavigate = () => {
  router.push({ name: 'book-detail', params: { id: props.book.id } });
};

const handleLoad = () => {
  isLoaded.value = true;
};

const handleError = () => {
  isError.value = true;
};

const formatAmount = (amount: number) => {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万';
  }
  return amount.toString();
};
</script>
