<template>
  <section class="latest-works">
    <div class="section-header">
      <h2 class="section-title">最新力作</h2>
      <button class="more-btn">查看更多</button>
    </div>
    <div class="latest-list">
      <div v-for="i in 8" :key="i" class="latest-item">
        <span class="category">[玄幻]</span>
        <span class="title">书名测试占位符 {{ i }}</span>
        <span class="author">作者 {{ i }}</span>
        <span class="time">04-24</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import './LatestWorks.css';
</script>
