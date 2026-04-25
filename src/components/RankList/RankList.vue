<template>
  <div class="rank-comp">
    <div class="rank-upper">
      <div class="title-box">排行榜</div>
      <div class="rank-box">
        <ul>
          <li class="sort-option" :class="{ select: activeTab === 'read' }" @click="activeTab = 'read'">
            <div class="sort-option-box">阅读</div>
          </li>
          <li class="sort-option" :class="{ select: activeTab === 'star' }" @click="activeTab = 'star'">
            <div class="sort-option-box">收藏</div>
          </li>
          <li class="sort-option" :class="{ select: activeTab === 'new' }" @click="activeTab = 'new'">
            <div class="sort-option-box">最新</div>
          </li>
        </ul>
      </div>
    </div>

    <div class="rank-line"></div>

    <div class="rank-content">
      <n-spin :show="isLoading">
        <!-- 置顶书籍 -->
        <div class="top-card" v-if="displayBooks.length > 0">
          <div class="top-card-left card" @click="handleBookClick(displayBooks[0]?.id)">
            <div class="img-warp">
              <img :src="displayBooks[0]?.cover_image" :alt="displayBooks[0]?.name">
            </div>
            <div class="info-area">
              <p class="info-title">{{ displayBooks[0]?.name }}</p>
              <p class="info-desc">{{ displayBooks[0]?.description }}</p>
              <p class="info-read">阅读量：{{ formatAmount(displayBooks[0]?.browse_amount || 0) }}</p>
              <p class="info-push">上架时间：{{ formatDate(displayBooks[0]?.push_at || displayBooks[0]?.created_at) }}</p>
             </div>
           </div>

           <div class="book-division" v-if="displayBooks.length > 1"></div>

           <div class="top-card-right card" v-if="displayBooks.length > 1" @click="handleBookClick(displayBooks[1]?.id)">
             <div class="img-warp">
               <img :src="displayBooks[1]?.cover_image" :alt="displayBooks[1]?.name">
             </div>
             <div class="info-area">
               <p class="info-title">{{ displayBooks[1]?.name }}</p>
               <p class="info-desc">{{ displayBooks[1]?.description }}</p>
               <p class="info-read">阅读量：{{ formatAmount(displayBooks[1]?.browse_amount || 0) }}</p>
               <p class="info-push">上架时间：{{ formatDate(displayBooks[1]?.push_at || displayBooks[1]?.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- 普通排行列表 -->
        <ul class="rank-list" v-if="displayBooks.length > 2">
          <RankCard 
            v-for="index in Math.min(8, displayBooks.length - 2)" 
            :key="index"
            :rank="index + 2"
            :book="displayBooks[index + 1]"
            @click="handleBookClick(displayBooks[index + 1]?.id)"
          />
        </ul>

        <n-empty v-if="!isLoading && displayBooks.length === 0" description="暂无排行榜数据" />
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getBookListApi } from '../../api/book';
import type { BookResponse } from '../../api/book';
import RankCard from '../RankCard/RankCard.vue';
import './RankList.css'

const router = useRouter();
const activeTab = ref('read');
const books = ref<BookResponse[]>([]);
const isLoading = ref(false);

const sortKeyMap: Record<string, 'browse_amount' | 'bookshelf_amount' | 'new_push'> = {
  read: 'browse_amount',
  star: 'bookshelf_amount',
  new: 'new_push'
};

const fetchBooks = async () => {
  isLoading.value = true;
  try {
    const res = await getBookListApi({
      page: 1,
      size: 10,
      sort_key: sortKeyMap[activeTab.value],
      sort_order: 'desc'
    });
    if (res.data.code === 200) {
      books.value = res.data.data.books;
    }
  } catch (error) {
    console.error('Failed to fetch rank books:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchBooks();
});

watch(activeTab, () => {
  fetchBooks();
});

const displayBooks = computed(() => books.value);

const formatAmount = (amount: number) => {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万';
  }
  return amount.toString();
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const handleBookClick = (id?: string) => {
  if (id) {
    router.push({ name: 'book-detail', params: { id } });
  }
};
</script>
