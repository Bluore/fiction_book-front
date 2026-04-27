<template>
  <div class="home-recent">
    <section class="paper-section">
      <div class="section-header">
        <h2 class="section-title">最近在读</h2>
      </div>
      <div v-if="loading" class="loading-state">
        加载中...
      </div>
      <div v-else-if="recentBooks.length === 0" class="empty-state">
        暂无阅读历史
      </div>
      <div v-else class="book-grid">
        <PaperBookCard 
          v-for="book in recentBooks" 
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
import { ref, onMounted } from 'vue';
import PaperBookCard from './PaperBookCard.vue';
import { getReadingHistoryApi, type BookResponse } from '@/api/book';

const recentBooks = ref<BookResponse[]>([]);
const loading = ref(true);

const fetchRecentBooks = async () => {
  try {
    loading.value = true;
    const res = await getReadingHistoryApi({ page: 1, size: 8 });
    recentBooks.value = res.data.data.books;
  } catch (error) {
    console.error('Failed to fetch recent books:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRecentBooks();
});
</script>

<style scoped>
.loading-state, .empty-state {
  padding: 40px;
  text-align: center;
  color: #666;
  font-style: italic;
}
</style>
