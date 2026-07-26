<template>
  <div class="rank-page">
    <Header />
    <div class="page-warp__">
      <div class="page rank-container">
        <!-- 侧边栏导航 (类似排行榜的 Tab) -->
        <aside class="rank-sidebar">
          <h2 class="sidebar-title">排行榜</h2>
          <ul class="rank-nav">
            <li 
              v-for="tab in tabs" 
              :key="tab.value"
              class="nav-item"
              :class="{ active: currentTab === tab.value }"
              @click="currentTab = tab.value"
            >
              {{ tab.label }}
            </li>
          </ul>
        </aside>

        <!-- 主内容区 -->
        <main class="rank-main">
          <div class="rank-header">
            <h2>{{ currentTabLabel }}</h2>
            <span class="rank-desc">榜单展示前100名书籍</span>
          </div>

          <div class="rank-list-wrapper">
            <n-spin :show="isLoading" style="min-height: 300px">
              <div v-if="books.length > 0" class="rank-list">
                <div 
                  v-for="(book, index) in books" 
                  :key="book.id"
                  class="rank-list-item"
                  @click="handleNavigate(book.id)"
                >
                  <div class="rank-number" :class="getRankClass(index + 1)">
                    {{ index + 1 }}
                  </div>
                  <div class="book-cover-wrapper">
                    <img :src="book.cover_image" :alt="book.name" class="book-cover" />
                    <div v-if="book.vip_level" class="vip-tag">{{ book.vip_level.toUpperCase() }}</div>
                  </div>
                  <div class="book-info">
                    <h3 class="book-title">{{ book.name }}</h3>
                    <p class="book-description">{{ book.description }}</p>
                    <div class="book-meta">
                      <span class="book-author">作者：佚名</span>
                      <span class="book-stats">
                        <svg class="icon-eye" viewBox="0 0 24 24" width="14" height="14">
                          <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                        阅读量：{{ formatAmount(book.browse_amount) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <n-empty v-if="!isLoading && books.length === 0" description="暂无排行榜数据" />
            </n-spin>
          </div>
        </main>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header/Header.vue';
import Footer from '@/components/Footer/Footer.vue';
import { getDailyThermalApi, getWeeklyThermalApi, getMonthlyThermalApi } from '@/api/book';
import type { BookResponse } from '@/api/book';
import './Rank.css';

const router = useRouter();

const tabs = [
  { label: '日排行榜', value: 'daily' },
  { label: '周排行榜', value: 'weekly' },
  { label: '月排行榜', value: 'monthly' }
];

const currentTab = ref('daily');
const books = ref<BookResponse[]>([]);
const isLoading = ref(false);

const currentTabLabel = computed(() => {
  const tab = tabs.find(t => t.value === currentTab.value);
  return tab ? tab.label : '';
});

const getRankClass = (rank: number) => {
  if (rank === 1) return 'rank-top1';
  if (rank === 2) return 'rank-top2';
  if (rank === 3) return 'rank-top3';
  return 'rank-normal';
};

const formatAmount = (amount: number) => {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万';
  }
  return amount.toString();
};

const handleNavigate = (id: string) => {
  router.push({ name: 'book-detail', params: { id } });
};

const fetchRankData = async () => {
  isLoading.value = true;
  books.value = [];
  try {
    const params = { page: 1, size: 100 }; // 请求前100项
    let res;
    
    if (currentTab.value === 'daily') {
      res = await getDailyThermalApi(params);
    } else if (currentTab.value === 'weekly') {
      res = await getWeeklyThermalApi(params);
    } else if (currentTab.value === 'monthly') {
      res = await getMonthlyThermalApi(params);
    }

    if (res && res.data.code === 200) {
      books.value = res.data.data?.books || [];
    }
  } catch (error) {
    console.error('获取排行榜失败:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchRankData();
});

watch(currentTab, () => {
  fetchRankData();
});
</script>