<template>
  <div class="book-chapter-search-list-item" @click="handleNavigate">
    <div class="book-cover-wrapper" v-if="chapter.Book">
      <img
        v-show="isLoaded"
        :src="chapter.Book.cover_image"
        :alt="chapter.Book.name"
        class="book-cover"
        @load="handleLoad"
        @error="handleError"
      />
      <div v-if="isError" class="error-placeholder">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c0 1.1-.9 2-2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      </div>
      <div v-if="chapter.Book.vip_level" class="vip-tag">{{ chapter.Book.vip_level?.toUpperCase() }}</div>
    </div>
    <div class="chapter-info">
      <h3 class="book-title" v-html="chapter.Book?.name"></h3>
      <p class="book-description" v-html="chapter.Book?.description"></p>
      <h4 class="chapter-title" v-html="highlight?.title || chapter.title"></h4>
      <p class="chapter-content" v-html="truncatedContent"></p>
      <div class="chapter-meta">
        <span class="chapter-price" v-if="chapter.price">￥{{ (chapter.price / 100).toFixed(2) }}</span>
        <span class="chapter-vip" v-if="chapter.vip_level">{{ chapter.vip_level.toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
// Assuming BookMetadata is available or will be defined.
// For now, I'll define local types based on the example.

// Define types based on the example response
interface BookMetadata {
  id: string;
  name: string;
  description: string;
  cover_image: string;
  owner_id: string;
  vip_level: string;
  price: number;
  push_at: string;
  browse_amount: number;
  bookshelf_amount: number;
  created_at: string;
  updated_at: string;
}

interface BookChapter {
  chapter_id: string;
  title: string;
  content?: string;
  order: number;
  vip_level: string;
  price: number;
  Book?: BookMetadata;
}

interface BookChapterHighlight {
  content?: string;
  title?: string;
}

const router = useRouter();
const props = defineProps<{
  chapter: BookChapter;
  highlight?: BookChapterHighlight;
}>();

const isLoaded = ref(false);
const isError = ref(false);

const handleNavigate = () => {
  if (props.chapter.Book?.id && props.chapter.chapter_id) {
    router.push({ name: 'reading', params: { id: props.chapter.Book.id, chapterId: props.chapter.chapter_id } });
  }
};

const handleLoad = () => {
  isLoaded.value = true;
};

const handleError = () => {
  isError.value = true;
};

const TRUNCATE_LENGTH = 150; // Max length for content
const truncatedContent = computed(() => {
  const contentToDisplay = props.highlight?.content || props.chapter.content || '';
  if (contentToDisplay.length > TRUNCATE_LENGTH) {
    // Remove HTML tags for length calculation, then re-add if needed for highlighting
    const plainTextContent = contentToDisplay.replace(/<[^>]*>?/gm, '');
    if (plainTextContent.length > TRUNCATE_LENGTH) {
        return contentToDisplay.substring(0, TRUNCATE_LENGTH) + '...';
    }
  }
  return contentToDisplay;
});

</script>

<style scoped>
/* Import the CSS file */
@import './BookChapterSearchListItem.css';
</style>
