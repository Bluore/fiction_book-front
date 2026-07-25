<template>
  <div class="search-view">
    <Header />
    <div class="page-warp">
      <div class="page">
        <!-- 搜索栏 -->
        <SearchBar v-model="searchQuery" @search="handleSearch" />

        <!-- 过滤器 -->
        <div class="filter-panel">
          <!-- 搜索目标 -->
          <div class="filter-row">
            <span class="filter-label">搜索目标：</span>
            <div class="filter-options">
              <label class="radio-label">
                <input type="radio" v-model="filters.target" value="book" @change="handleSearch" /> 搜书籍
              </label>
              <label class="radio-label">
                <input type="radio" v-model="filters.target" value="chapter" @change="handleSearch" /> 搜章节
              </label>
            </div>
          </div>
          <!-- VIP等级 -->
          <div class="filter-row">
            <span class="filter-label">VIP 等级：</span>
            <div class="filter-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="filters.vipAll" @change="onVipAllChange" /> 全部
              </label>
              <label class="checkbox-label" v-for="level in vipOptions" :key="level.value">
                <input type="checkbox" :value="level.value" v-model="filters.vipLevels" @change="onVipChange" /> {{ level.label }}
              </label>
            </div>
          </div>
          <!-- 价格 -->
          <div class="filter-row">
            <span class="filter-label">价格：</span>
            <div class="filter-options">
              <label class="radio-label" v-for="opt in priceOptions" :key="opt.value">
                <input type="radio" v-model="filters.price" :value="opt.value" @change="handleSearch" /> {{ opt.label }}
              </label>
            </div>
          </div>
          <!-- 热门 (仅书籍模式) -->
          <div class="filter-row" v-if="filters.target === 'book'">
            <span class="filter-label">热度：</span>
            <div class="filter-options">
              <label class="radio-label" v-for="opt in hotnessOptions" :key="opt.value">
                <input type="radio" v-model="filters.hotness" :value="opt.value" @change="handleSearch" /> {{ opt.label }}
              </label>
            </div>
          </div>
          <!-- 时间过滤 -->
          <div class="filter-row">
            <span class="filter-label">{{ filters.target === 'book' ? '发行时间' : '发布时间' }}：</span>
            <div class="filter-options">
              <label class="radio-label" v-for="opt in timeOptions" :key="opt.value">
                <input type="radio" v-model="filters.publish_time" :value="opt.value" @change="handleSearch" /> {{ opt.label }}
              </label>
            </div>
          </div>
          <div class="filter-row" v-if="filters.target === 'book'">
            <span class="filter-label">更新时间：</span>
            <div class="filter-options">
              <label class="radio-label" v-for="opt in timeOptions" :key="opt.value">
                <input type="radio" v-model="filters.update_time" :value="opt.value" @change="handleSearch" /> {{ opt.label }}
              </label>
            </div>
          </div>
        </div>

        <!-- 结果列表 -->
        <div class="results-container">
          <!-- 书籍列表 -->
          <template v-if="filters.target === 'book'">
            <div class="book-grid">
              <BookCard 
                v-for="item in bookList" 
                :key="item.book.id" 
                :book="item.book" 
                :show-description="true" 
              />
            </div>
          </template>
          
          <!-- 章节列表 -->
          <template v-else>
            <div class="chapter-list">
              <div 
                class="chapter-item" 
                v-for="item in chapterList" 
                :key="item.book_chapter.chapter_id"
                @click="goToChapter(item.book_chapter)"
              >
                <h3 class="chapter-title" v-html="item.highlight?.title || item.book_chapter.title"></h3>
                <p class="chapter-desc" v-html="item.highlight?.content || item.book_chapter.content"></p>
                <div class="chapter-meta">
                  <span>所属书籍: {{ item.book_chapter.Book?.name || '未知' }}</span>
                  <span v-if="item.book_chapter.vip_level" class="vip-tag">{{ item.book_chapter.vip_level.toUpperCase() }}</span>
                  <span v-if="item.book_chapter.price">价格: ￥{{ (item.book_chapter.price / 100).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 滚动加载状态触发器 -->
          <div class="loading-status" ref="loadMoreTrigger">
            <span v-if="loading">加载中...</span>
            <span v-else-if="noMore && (bookList.length > 0 || chapterList.length > 0)">没有更多数据了</span>
            <span v-else-if="noMore && bookList.length === 0 && chapterList.length === 0">暂无相关结果</span>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header/Header.vue'
import Footer from '@/components/Footer/Footer.vue'
import SearchBar from '@/components/SearchBar/SearchBar.vue'
import BookCard from '@/components/BookCard/BookCard.vue'
import { searchBooksApi, searchChaptersApi, type SearchParams, type BookSearchItem, type ChapterSearchItem } from '@/api/search'
import type { BookChapterResponse } from '@/api/book'
import './Search.css'

const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.q as string || '')
const loadMoreTrigger = ref<HTMLElement | null>(null)

const vipOptions = [
  { label: '免费', value: 'vip_0' },
  { label: 'VIP1', value: 'vip_1' },
  { label: 'VIP2', value: 'vip_2' }
]

const priceOptions = [
  { label: '全部', value: 'all' },
  { label: '1~100', value: '1-100' },
  { label: '101~1000', value: '101-1000' },
  { label: '1001以上', value: '1001-' }
]

const hotnessOptions = [
  { label: '全部', value: 'all' },
  { label: '0~100', value: '0-100' },
  { label: '101~1000', value: '101-1000' },
  { label: '1001以上', value: '1001-' }
]

const timeOptions = [
  { label: '全部', value: 'all' },
  { label: '3天内', value: '3d' },
  { label: '7天内', value: '7d' },
  { label: '30天内', value: '30d' },
  { label: '1年内', value: '1y' }
]

const filters = reactive({
  target: 'book',
  vipAll: true,
  vipLevels: [] as string[],
  price: 'all',
  hotness: 'all',
  publish_time: 'all',
  update_time: 'all'
})

const onVipAllChange = () => {
  if (filters.vipAll) filters.vipLevels = []
  handleSearch()
}

const onVipChange = () => {
  filters.vipAll = filters.vipLevels.length === 0
  handleSearch()
}

const bookList = ref<BookSearchItem[]>([])
const chapterList = ref<ChapterSearchItem[]>([])
const loading = ref(false)
const noMore = ref(false)
let lastId = ''

const parseTime = (val: string) => {
  if (val === 'all') return undefined
  const now = Math.floor(Date.now() / 1000)
  const days = { '3d': 3, '7d': 7, '30d': 30, '1y': 365 }[val] || 0
  return (now - days * 86400).toString()
}

const buildParams = (): SearchParams => {
  const params: SearchParams = { limit: 10 }
  if (searchQuery.value) params.query = searchQuery.value
  
  if (!filters.vipAll && filters.vipLevels.length > 0) {
    const selectedVipLevels: string[] = [];
    if (filters.vipLevels.includes('vip_0')) {
      selectedVipLevels.push(''); // 代表空值，游客可读
      selectedVipLevels.push('vip_0'); // 代表免费
    }
    filters.vipLevels.forEach(level => {
      if (level !== 'vip_0') {
        selectedVipLevels.push(level);
      }
    });
    params.vip_level = selectedVipLevels.join(',');
  }
  
  if (filters.price !== 'all') {
    let min, max
    if (filters.price === '1-100') { min = 1; max = 100 }
    else if (filters.price === '101-1000') { min = 101; max = 1000 }
    else if (filters.price === '1001-') { min = 1001 }
    
    if (filters.target === 'book') {
      params.price_min = min; params.price_max = max
    } else {
      params.price_start = min; params.price_end = max
    }
  }
  
  if (filters.target === 'book' && filters.hotness !== 'all') {
    if (filters.hotness === '0-100') { params.hot_min = 0; params.hot_max = 100 }
    else if (filters.hotness === '101-1000') { params.hot_min = 101; params.hot_max = 1000 }
    else if (filters.hotness === '1001-') { params.hot_min = 1001 }
  }
  
  const pTime = parseTime(filters.publish_time)
  if (pTime) {
    if (filters.target === 'book') params.push_start_time = pTime
    else params.created_at_start = pTime
  }
  
  const uTime = parseTime(filters.update_time)
  if (uTime && filters.target === 'book') {
    params.update_start_time = uTime
  }
  
  if (lastId) params.last_id = lastId
  
  return params
}

const handleSearch = () => {
  bookList.value = []
  chapterList.value = []
  lastId = ''
  noMore.value = false
  
  router.replace({ query: { ...route.query, q: searchQuery.value || undefined } })
  loadData()
}

const loadData = async () => {
  if (loading.value || noMore.value) return
  
  loading.value = true
  try {
    const params = buildParams()
    if (filters.target === 'book') {
      const res = await searchBooksApi(params)
      const data = res.data.data?.books || []
      if (data && data.length > 0) {
        bookList.value.push(...data)
        lastId = data[data.length - 1].book.id
      } else {
        noMore.value = true
      }
    } else {
      const res = await searchChaptersApi(params)
      const data = res.data.data?.chapters || []
      if (data && data.length > 0) {
        chapterList.value.push(...data)
        lastId = data[data.length - 1].book_chapter.chapter_id
      } else {
        noMore.value = true
      }
    }
  } catch (error) {
    console.error('搜索请求失败:', error)
    noMore.value = true
  } finally {
    loading.value = false
  }
}

const goToChapter = (chapter: BookChapterResponse) => {
  if (chapter.Book?.id) {
    router.push({ name: 'reading', params: { id: chapter.Book.id, chapterId: chapter.chapter_id } })
  }
}

watch(() => route.query.q, (newQ) => {
  if (newQ !== undefined && newQ !== searchQuery.value) {
    searchQuery.value = newQ as string
    handleSearch()
  }
})

let observer: IntersectionObserver | null = null

onMounted(() => {
  handleSearch()
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) loadData()
  }, { threshold: 0.1 })
  
  if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>