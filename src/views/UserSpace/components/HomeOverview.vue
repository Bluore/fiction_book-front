<template>
  <div class="home-overview">
    <!-- 最近在读 -->
    <section class="paper-section">
      <div class="section-header">
        <h2 class="section-title">最近在读</h2>
        <span class="more-link">查看全部</span>
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
          :id="book.id"
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
      <div v-if="bookshelfLoading" class="loading-state">
        加载中...
      </div>
      <div v-else-if="bookshelfBooks.length === 0" class="empty-state">
        暂无书架书籍
      </div>
      <div v-else class="book-grid">
        <PaperBookCard 
          v-for="book in bookshelfBooks" 
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
import { ref, computed, onMounted } from 'vue';
import PaperBookCard from './PaperBookCard.vue';
import { mockBooks } from '@/mocks/books';
import { getReadingHistoryApi, getBookshelfApi, type BookResponse } from '@/api/book';

const recentBooks = ref<BookResponse[]>([]);
const bookshelfBooks = ref<BookResponse[]>([]);
const loading = ref(true);
const bookshelfLoading = ref(true);

const purchasedBooks = computed(() => mockBooks.slice(3, 6));

const fetchRecentBooks = async () => {
  try {
    loading.value = true;
    const res = await getReadingHistoryApi({ page: 1, size: 3 });
    recentBooks.value = res.data.data.books;
  } catch (error) {
    console.error('Failed to fetch recent books:', error);
  } finally {
    loading.value = false;
  }
};

const fetchBookshelfBooks = async () => {
  try {
    bookshelfLoading.value = true;
    const res = await getBookshelfApi({ page: 1, size: 3 });
    bookshelfBooks.value = res.data.data.books;
  } catch (error) {
    console.error('Failed to fetch bookshelf books:', error);
  } finally {
    bookshelfLoading.value = false;
  }
};

onMounted(() => {
  fetchRecentBooks();
  fetchBookshelfBooks();
});
</script>

<style scoped>
.loading-state, .empty-state {
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
  width: 100%;
}
</style>
