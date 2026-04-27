<template>
  <div class="home-bookshelf">
    <section class="paper-section">
      <div class="section-header">
        <h2 class="section-title">我的书架</h2>
      </div>
      <div class="book-grid">
        <div v-if="loading" class="loading-state">
          加载中...
        </div>
        <div v-else-if="allBooks.length === 0" class="empty-state">
          书架空空如也，快去收藏喜欢的书吧！
        </div>
        <template v-else>
          <PaperBookCard 
            v-for="book in allBooks" 
            :key="book.id"
            :id="book.id"
            :title="book.name"
            :cover-image="book.cover_image"
          />
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PaperBookCard from './PaperBookCard.vue';
import { getBookshelfApi, type BookResponse } from '@/api/book';

const allBooks = ref<BookResponse[]>([]);
const loading = ref(true);

const fetchBookshelf = async () => {
  try {
    loading.value = true;
    const res = await getBookshelfApi();
    allBooks.value = res.data.data.books;
  } catch (error) {
    console.error('Failed to fetch bookshelf:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBookshelf();
});
</script>

<style scoped>
.loading-state, .empty-state {
  padding: 40px;
  text-align: center;
  color: #666;
  font-style: italic;
  width: 100%;
}
</style>
