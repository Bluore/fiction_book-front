<template>
  <div class="book-header">
    <div class="book-cover-container">
      <div class="book-cover-wrapper">
        <img :src="book.cover_image" :alt="book.name" class="book-cover" />
        <div class="scan-line"></div>
      </div>
    </div>
    
    <div class="book-info-container">
      <div class="book-main-info">
        <h1 class="book-title">{{ book.name }}</h1>
        <div class="book-author">作者：<span class="author-name">{{ author?.username || '加载中...' }}</span></div>
      </div>
      
      <div class="book-stats">
        <div class="stat-item">
          <span class="stat-label">收藏量</span>
          <span class="stat-value">{{ formatAmount(book.bookshelf_amount) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">阅读量</span>
          <span class="stat-value">{{ formatAmount(book.browse_amount) }}</span>
        </div>
      </div>
      
      <p class="book-description">{{ book.description }}</p>
      
      <div class="book-actions">
        <button class="btn-text" @click="handleAddToBookshelf">加入书架</button>
        <button class="btn-text">分享书籍</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { addToBookshelfApi } from '@/api/book';
import type { BookResponse } from '@/api/book';
import type { UserInfo } from '@/utils/auth';

const props = defineProps<{
  book: BookResponse;
  author: UserInfo | null;
}>();

const message = useMessage();

const handleAddToBookshelf = async () => {
  try {
    const res = await addToBookshelfApi(props.book.id);
    if (res.data.code === 200) {
      message.success('已成功加入书架');
    } else {
      message.error(res.data.message || '加入书架失败');
    }
  } catch (error: any) {
    message.error(error.message || '加入书架失败，请稍后重试');
  }
};

const formatAmount = (amount: number) => {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万';
  }
  return amount.toString();
};
</script>

<style scoped>
.book-header {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.book-cover-container {
  flex-shrink: 0;
}

.book-cover-wrapper {
  position: relative;
  width: 240px; /* 缩放一点，原图 368x460 比例 */
  height: 300px;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  background-color: #eee;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 扫描线动画 */
.scan-line {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease-in-out;
}

.book-cover-wrapper:hover .scan-line {
  left: 100%;
}

.book-info-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.book-title {
  font-size: 2.2rem;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.book-author {
  color: #666;
  font-size: 1rem;
}

.author-name {
  text-decoration: underline;
  cursor: pointer;
}

.book-stats {
  display: flex;
  gap: 30px;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 0.85rem;
  color: #888;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 500;
}

.book-description {
  font-size: 1rem;
  line-height: 1.8;
  color: #444;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-actions {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.btn-text {
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.btn-text:hover {
  color: #000;
}
</style>
