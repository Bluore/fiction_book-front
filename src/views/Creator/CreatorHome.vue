<template>
  <div class="creator-home paper-theme">
    <div class="content-container">
      <header class="creator-header">
        <div class="header-left">
          <button class="text-btn underline" @click="goHome">首页</button>
          <span class="separator">/</span>
          <h1 class="page-title">创作中心</h1>
        </div>
        <button class="text-btn underline" @click="handleCreateBook">新建作品</button>
      </header>

      <div class="book-grid" v-if="books.length > 0">
        <div v-for="book in books" :key="book.id" class="creator-book-item">
          <div class="book-cover-section" @click="goToEditor(book.id)">
            <PaperBookCover :cover-image="book.cover_image" :title="book.name" />
          </div>
          <div class="book-info-section">
            <h3 class="book-name">{{ book.name }}</h3>
            <p class="book-meta">
              <span>{{ book.browse_amount }} 阅读</span>
              <span class="dot-separator">·</span>
              <span>{{ book.bookshelf_amount }} 收藏</span>
            </p>
            <div class="book-actions">
              <button class="text-btn underline" @click="goToEditor(book.id)">管理</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>还没有创作任何作品，开始你的第一个故事吧。</p>
        <button class="text-btn underline" @click="handleCreateBook">立即创作</button>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.count > pagination.size" class="pagination-container">
        <n-pagination
          v-model:page="pagination.page"
          :item-count="pagination.count"
          :page-size="pagination.size"
          @update:page="handlePageChange"
        />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import PaperBookCover from '@/components/PaperBookCover/PaperBookCover.vue'
import Footer from '@/components/Footer/Footer.vue'
import { getCreatorBooksApi } from '@/api/creator'
import { mockBooks } from '@/mocks/books'
import type { BookResponse } from '@/api/book'

const router = useRouter()
const message = useMessage()
const books = ref<BookResponse[]>([])
const pagination = ref({
  page: 1,
  size: 10,
  count: 0
})

const fetchBooks = async () => {
  try {
    const res = await getCreatorBooksApi({
      page: pagination.value.page,
      size: pagination.value.size
    })
    if (res.data.code === 200) {
      books.value = res.data.data.books
      pagination.value.count = res.data.data.count
    } else {
      // Fallback to mock data for current user
      books.value = mockBooks.filter(b => b.owner_id === 'current-user-id') as any
      pagination.value.count = books.value.length
      message.warning('无法从服务器获取作品列表，已加载本地数据')
    }
  } catch (error) {
    console.error('获取作品失败:', error)
    books.value = mockBooks.filter(b => b.owner_id === 'current-user-id') as any
    pagination.value.count = books.value.length
  }
}

const handlePageChange = (page: number) => {
  pagination.value.page = page
  fetchBooks()
}

const handleCreateBook = () => {
  router.push({ name: 'creator-book-create' })
}

const goToEditor = (id: string) => {
  router.push({ name: 'creator-book-editor', params: { id } })
}

const goHome = () => {
  router.push({ name: 'home' })
}

onMounted(() => {
  fetchBooks()
})
</script>

<style scoped src="./CreatorHome.css"></style>
