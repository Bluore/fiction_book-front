<template>
  <div class="book-library-view">
    <Header />
    
    <div class="page-warp">
      <div class="page">
        <div class="library-header">
          <h1>书库</h1>
          <n-breadcrumb>
            <n-breadcrumb-item @click="$router.push('/')">首页</n-breadcrumb-item>
            <n-breadcrumb-item>书库</n-breadcrumb-item>
          </n-breadcrumb>
        </div>

        <div class="filter-section">
          <div class="filter-group">
            <span class="filter-label">排序方式:</span>
            <n-radio-group v-model:value="queryParams.sort_key" name="sortKey" @update:value="handleSearch">
              <n-radio-button value="new_push">最新发布</n-radio-button>
              <n-radio-button value="new_update">最近更新</n-radio-button>
              <n-radio-button value="browse_amount">点击最多</n-radio-button>
              <n-radio-button value="bookshelf_amount">收藏最多</n-radio-button>
            </n-radio-group>
          </div>
          
          <div class="filter-group">
            <span class="filter-label">排序方向:</span>
            <n-select
              v-model:value="queryParams.sort_order"
              :options="orderOptions"
              style="width: 120px"
              @update:value="handleSearch"
            />
          </div>
        </div>

        <div v-if="loading" class="loading-container">
          <n-spin size="large" />
          <p>加载中...</p>
        </div>

        <template v-else>
          <div v-if="books.length > 0" class="book-grid">
            <BookCard
              v-for="book in books"
              :key="book.id"
              :book="book"
              show-description
            />
          </div>
          <div v-else class="empty-container">
            <n-empty description="暂无书籍" />
          </div>

          <div class="pagination-container" v-if="total > queryParams.size">
            <n-pagination
              v-model:page="queryParams.page"
              v-model:page-size="queryParams.size"
              :item-count="total"
              show-size-picker
              :page-sizes="[10, 20, 30, 40]"
              @update:page="handlePageChange"
              @update:page-size="handleSizeChange"
            />
          </div>
        </template>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { getBookListApi, type BookResponse, type BookListParams } from '@/api/book';
import Header from '@/components/Header/Header.vue';
import Footer from '@/components/Footer/Footer.vue';
import BookCard from '@/components/BookCard/BookCard.vue';
import './BookLibrary.css';

const loading = ref(false);
const books = ref<BookResponse[]>([]);
const total = ref(0);

const queryParams = reactive<Required<Pick<BookListParams, 'page' | 'size' | 'sort_key' | 'sort_order'>>>({
  page: 1,
  size: 20,
  sort_key: 'new_push',
  sort_order: 'desc'
});

const orderOptions = [
  { label: '降序', value: 'desc' },
  { label: '升序', value: 'asc' }
];

const fetchBooks = async () => {
  loading.value = true;
  try {
    const res = await getBookListApi({
      ...queryParams
    });
    if (res.data.code === 200 || res.data.code === 0) {
      books.value = res.data.data.books;
      total.value = res.data.data.count;
    }
  } catch (error) {
    console.error('Failed to fetch books:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  queryParams.page = 1;
  fetchBooks();
};

const handlePageChange = (page: number) => {
  queryParams.page = page;
  fetchBooks();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleSizeChange = (size: number) => {
  queryParams.size = size;
  queryParams.page = 1;
  fetchBooks();
};

onMounted(() => {
  fetchBooks();
});
</script>
