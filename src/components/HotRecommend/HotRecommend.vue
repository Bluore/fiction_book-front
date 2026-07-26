<template>
  <section class="hot-recommend">
    <div class="section-header">
      <div class="title-group">
        <h2 class="section-title">热门推荐</h2>
        <span class="page-indicator" v-if="books.length > 0">{{ currentPage + 1 }}/{{ totalPages }}</span>
      </div>
      <div class="nav-controls">
        <button class="nav-btn prev" @click="prevPage" :disabled="totalPages <= 1">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <button class="nav-btn next" @click="nextPage" :disabled="totalPages <= 1">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
        <button class="more-btn" @click="goToRank">查看更多</button>
      </div>
    </div>
    <div class="carousel-container">
      <n-spin :show="isLoading" style="min-height: 200px">
        <div 
          class="carousel-track" 
          :style="{ transform: `translateX(-${currentPage * 100}%)` }"
          v-if="books.length > 0"
        >
          <div v-for="page in totalPages" :key="page" class="carousel-page">
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
        <n-empty v-if="!isLoading && books.length === 0" description="暂无热门推荐数据" />
      </n-spin>
    </div>
    <div class="pagination-dots" v-if="totalPages > 1">
      <span 
        v-for="i in totalPages" 
        :key="i" 
        :class="['dot', { active: currentPage === i - 1 }]"
        @click="currentPage = i - 1"
      ></span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import BookCard from '../BookCard/BookCard.vue';
import { getMonthlyThermalApi } from '../../api/book';
import type { BookResponse } from '../../api/book';
import './HotRecommend.css';

const currentPage = ref(0);
const books = ref<BookResponse[]>([]);
const isLoading = ref(false);
const router = useRouter();

const goToRank = () => {
  router.push('/rank');
};

const totalPages = computed(() => Math.max(1, Math.ceil(books.value.length / 9)));

const getBooksForPage = (pageIndex: number) => {
  return books.value.slice(pageIndex * 9, (pageIndex + 1) * 9);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
  } else {
    currentPage.value = 0; // Loop back
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  } else {
    currentPage.value = totalPages.value - 1; // Loop back
  }
};

const fetchHotRecommend = async () => {
  isLoading.value = true;
  try {
    const res = await getMonthlyThermalApi({ page: 1, size: 27 });
    if (res.data.code === 200) {
      books.value = res.data.data?.books || [];
    }
  } catch (error) {
    console.error('Failed to fetch hot recommend:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchHotRecommend();
});
</script>
