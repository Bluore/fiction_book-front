<template>
  <div class="chapter-list">
    <div 
      v-for="chapter in sortedChapters" 
      :key="chapter.chapter_id"
      class="chapter-item"
      :class="{
        'is-read': isRead(chapter.chapter_id),
        'is-current': chapter.chapter_id === lastReadId
      }"
      @click="$emit('select', chapter)"
    >
      <span class="chapter-order">{{ formatOrder(chapter.order) }}</span>
      <span class="chapter-title">{{ chapter.title }}</span>
      
      <div class="chapter-info">
        <span v-if="chapter.vip_level && chapter.vip_level !== 'free'" class="vip-tag">VIP</span>
        <span v-if="chapter.price > 0" class="price-tag">{{ chapter.price }} 金豆</span>
        <span v-else-if="chapter.vip_level === 'free' || !chapter.vip_level" class="free-tag">免费</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BookChapterResponse } from '@/api/book';

const props = defineProps<{
  chapters: BookChapterResponse[];
  lastReadId?: string;
  currentReadId?: string | null;
  bookId: string;
}>();

defineEmits<{
  (e: 'select', chapter: BookChapterResponse): void;
}>();

const sortedChapters = computed(() => {
  return [...props.chapters].sort((a, b) => a.order - b.order);
});

// 模拟已读状态判断
const isRead = (id: string) => {
  const readList = JSON.parse(localStorage.getItem(`read_list_${props.bookId}`) || '[]');
  return readList.includes(id) || id === props.lastReadId;
};

const formatOrder = (order: number) => {
  return order.toString().padStart(3, '0');
};
</script>

<style scoped>
.chapter-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px 30px;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  transition: all 0.2s;
  position: relative;
}

.chapter-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.chapter-order {
  font-family: monospace;
  font-size: 0.9rem;
  color: #999;
}

.chapter-title {
  font-size: 1rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.chapter-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.vip-tag {
  color: #d4a017;
  font-weight: bold;
  font-style: italic;
}

.price-tag {
  color: #999;
}

.free-tag {
  color: #52c41a;
  font-size: 0.8rem;
}

/* 已读状态：淡色文字 */
.chapter-item.is-read .chapter-title {
  color: #aaa;
}

/* 当前在读：醒目提示 */
.chapter-item.is-current {
  background-color: #fff;
  border-left: 3px solid #333;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.05);
}

.chapter-item.is-current .chapter-title {
  font-weight: 600;
  color: #000;
}

.vip-badge {
  font-size: 0.7rem;
  background-color: #f5f5f5;
  color: #d4af37;
  padding: 2px 4px;
  border-radius: 2px;
  margin-left: auto;
}
</style>
