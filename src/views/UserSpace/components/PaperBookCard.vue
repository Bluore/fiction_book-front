<template>
  <div class="paper-book-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div class="cover-container" @click="handleRead">
      <img :src="coverImage" class="book-cover" alt="book cover" />
      <div class="scan-overlay" :class="{ 'scan-active': isHovered, 'scan-reverse': !isHovered && hasHovered }"></div>
      <div class="paper-texture"></div>
    </div>
    <div class="book-info">
      <h3 class="book-title">{{ title }}</h3>
      <div class="book-actions">
        <button class="text-btn" @click="handleRead">阅读</button>
        <button class="text-btn" @click="handleDetail">详情</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  id: string;
  title: string;
  coverImage: string;
}>();

const router = useRouter();

const isHovered = ref(false);
const hasHovered = ref(false);

watch(isHovered, (newVal) => {
  if (newVal) hasHovered.value = true;
});

const handleRead = () => {
  // 尝试从本地存储获取阅读进度
  const progress = localStorage.getItem(`read_progress_${props.id}`);
  if (progress) {
    try {
      const { id: chapterId } = JSON.parse(progress);
      if (chapterId) {
        router.push(`/book/${props.id}/chapter/${chapterId}`);
        return;
      }
    } catch (e) {
      console.error('Failed to parse reading progress:', e);
    }
  }
  // 如果没有进度，跳转到详情页（详情页会自动处理“开始阅读”）
  router.push(`/book/${props.id}`);
};

const handleDetail = () => {
  router.push(`/book/${props.id}`);
};
</script>

<style scoped>
.paper-book-card {
  width: 100%;
  max-width: 368px;
  margin-bottom: 24px;
}

.cover-container {
  position: relative;
  width: 100%;
  aspect-ratio: 368 / 460;
  overflow: hidden;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.2);
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  cursor: pointer;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.paper-texture {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.05;
  background-image: url('https://www.transparenttextures.com/patterns/paper-fibers.png');
}

.scan-overlay {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    105deg,
    transparent 20%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 80%
  );
  z-index: 2;
  pointer-events: none;
  transform: translateX(-100%);
}

.scan-active {
  transform: translateX(100%);
  transition: transform 0.8s ease-out;
}

.scan-reverse {
  transform: translateX(-100%);
  transition: transform 0.8s ease-in;
}

.book-info {
  margin-top: 16px;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.book-title {
  font-size: 18px;
  margin: 0;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-actions {
  display: flex;
  gap: 16px;
}

.text-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.text-btn:hover {
  color: #000;
}
</style>
