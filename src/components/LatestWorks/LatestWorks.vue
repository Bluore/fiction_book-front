<template>
  <section class="latest-works">
    <div class="section-header">
      <h2 class="section-title">最新力作</h2>
      <button class="more-btn" @click="goToRank">查看更多</button>
    </div>
    <n-spin :show="isLoading" style="min-height: 150px">
      <div class="latest-list" v-if="books.length > 0">
        <div 
          v-for="book in books" 
          :key="book.id" 
          class="latest-item"
          @click="handleBookClick(book.id)"
          style="cursor: pointer;"
        >
          <span class="category">[图书]</span>
          <span class="title">{{ book.name }}</span>
          <span class="author">佚名</span>
          <span class="time">{{ formatTime(book.push_at || book.created_at) }}</span>
        </div>
      </div>
      <n-empty v-if="!isLoading && books.length === 0" description="暂无最新力作数据" />
    </n-spin>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getDailyThermalApi } from '../../api/book';
import type { BookResponse } from '../../api/book';
import './LatestWorks.css';

const router = useRouter();
const books = ref<BookResponse[]>([]);
const isLoading = ref(false);

const goToRank = () => {
  router.push('/rank');
};

const formatTime = (timeStr?: string | number) => {
  if (!timeStr) return '-';
  let date;
  if (typeof timeStr === 'number' || !isNaN(Number(timeStr))) {
    const ts = Number(timeStr);
    date = new Date(ts > 9999999999 ? ts : ts * 1000);
  } else {
    date = new Date(timeStr);
  }
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${m}-${d}`;
};

const handleBookClick = (id: string) => {
  if (id) {
    router.push({ name: 'book-detail', params: { id } });
  }
};

const fetchLatestWorks = async () => {
  isLoading.value = true;
  try {
    const res = await getDailyThermalApi({ page: 1, size: 8 });
    if (res.data.code === 200) {
      books.value = res.data.data?.books || [];
    }
  } catch (error) {
    console.error('Failed to fetch latest works:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchLatestWorks();
});
</script>
