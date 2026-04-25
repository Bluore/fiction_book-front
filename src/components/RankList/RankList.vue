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
      <!-- 置顶书籍 -->
      <div class="top-card">
        <div class="top-card-left card" @click="handleBookClick(displayBooks[0]?.id)">
          <div class="img-warp">
            <img :src="displayBooks[0]?.cover_image" :alt="displayBooks[0]?.name">
          </div>
          <div class="info-area">
            <p class="info-title">{{ displayBooks[0]?.name }}</p>
            <p class="info-desc">{{ displayBooks[0]?.description }}</p>
            <p class="info-read">阅读量：{{ formatAmount(displayBooks[0]?.browse_amount || 0) }}</p>
            <p class="info-push">上架时间：{{ displayBooks[0]?.created_at }}</p>
          </div>
        </div>

        <div class="book-division"></div>

        <div class="top-card-right card" @click="handleBookClick(displayBooks[1]?.id)">
          <div class="img-warp">
            <img :src="displayBooks[1]?.cover_image" :alt="displayBooks[1]?.name">
          </div>
          <div class="info-area">
            <p class="info-title">{{ displayBooks[1]?.name }}</p>
            <p class="info-desc">{{ displayBooks[1]?.description }}</p>
            <p class="info-read">阅读量：{{ formatAmount(displayBooks[1]?.browse_amount || 0) }}</p>
            <p class="info-push">上架时间：{{ displayBooks[1]?.created_at }}</p>
          </div>
        </div>
      </div>

      <!-- 普通排行列表 -->
      <ul class="rank-list">
        <RankCard 
          v-for="index in 8" 
          :key="index"
          :rank="index + 2"
          :book="displayBooks[index + 1]"
          @click="handleBookClick(displayBooks[index + 1]?.id)"
        />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { mockBooks } from '../../mocks/books';
import RankCard from '../RankCard/RankCard.vue';
import './RankList.css'

const router = useRouter();
const activeTab = ref('read');

const displayBooks = computed(() => {
  if (activeTab.value === 'read') return mockBooks.slice(0, 10);
  if (activeTab.value === 'star') return mockBooks.slice(10, 20);
  return mockBooks.slice(20, 30);
});

const formatAmount = (amount: number) => {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万';
  }
  return amount.toString();
};

const handleBookClick = (id?: string) => {
  if (id) {
    router.push({ name: 'book-detail', params: { id } });
  }
};
</script>
