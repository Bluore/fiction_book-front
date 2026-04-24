<template>
  <div class="rank-comp">
    <div class="rank-title-row">
      <h3 class="rank-title">排行榜</h3>
      <div class="rank-tabs">
        <span class="rank-tab active">阅读</span>
        <span class="rank-tab">收藏</span>
        <span class="rank-tab">最新</span>
      </div>
    </div>
    
    <ul class="rank-list">
      <li v-for="i in 10" :key="i" class="rank-item">
        <span class="rank-number" :class="{ 'top-three': i <= 3 }">{{ i }}</span>
        <span class="rank-book-name">书名占位符 {{ i }}</span>
        <span class="rank-book-author">作者</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import './RankList.css'
</script>
