<template>
  <div class="book-card" :class="{ 'has-rank': rank }">
    <div class="book-cover-wrapper">
      <img :src="book.cover_image" :alt="book.name" class="book-cover" />
      <div class="scan-line"></div>
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
import type { BookMetadata } from '../../mocks/books';
import './BookCard.css';

withDefaults(defineProps<{
  book: BookMetadata;
  showDescription?: boolean;
  rank?: number;
}>(), {
  showDescription: false
});

const formatAmount = (amount: number) => {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万';
  }
  return amount.toString();
};
</script>
