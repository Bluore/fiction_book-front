<template>
  <div class="book-detail-page">
    <Header />
    
    <div class="page-warp">
      <div class="page">
        <BookHeader :book="book" :author="author" v-if="book" />
        
        <div class="divider"></div>
        
        <div class="catalog-section">
          <div class="section-header">
            <h2 class="section-title">目录</h2>
            <button class="btn-text btn-continue" @click="handleContinueReading">
              {{ lastReadChapter ? '继续阅读' : '开始阅读' }}
            </button>
          </div>
          
          <ChapterList 
            :chapters="chapters" 
            :lastReadId="lastReadChapter?.id"
            :currentReadId="currentReadingId"
            :bookId="bookId"
            @select="handleChapterSelect"
          />
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Header from '@/components/Header/Header.vue';
import Footer from '@/components/Footer/Footer.vue';
import BookHeader from './components/BookHeader.vue';
import ChapterList from './components/ChapterList.vue';
import { getBookDetailApi, getBookChaptersApi } from '@/api/book';
import { getUserByIdApi } from '@/api/auth';
import type { BookResponse, BookChapterResponse } from '@/api/book';
import type { UserInfo } from '@/utils/auth';
import './BookDetail.css';

const route = useRoute();
const router = useRouter();
const bookId = route.params.id as string;

const book = ref<BookResponse | null>(null);
const author = ref<UserInfo | null>(null);
const chapters = ref<BookChapterResponse[]>([]);
const lastReadChapter = ref<{ id: string, title: string } | null>(null);
const currentReadingId = ref<string | null>(null);

const fetchBookData = async () => {
  try {
    const [bookRes, chaptersRes] = await Promise.all([
      getBookDetailApi(bookId),
      getBookChaptersApi(bookId)
    ]);
    
    if (bookRes.data.code === 200) {
      book.value = bookRes.data.data;
      
      // 根据 owner_id 获取作者信息
      if (book.value?.owner_id) {
        try {
          const authorRes = await getUserByIdApi(book.value.owner_id);
          if (authorRes.data.code === 200) {
            author.value = authorRes.data.data;
          }
        } catch (authorError) {
          console.error('Failed to fetch author info:', authorError);
        }
      }
    }
    
    if (chaptersRes.data.code === 200) {
      // 兼容示例响应中的 Chapters (首字母大写)
      chapters.value = chaptersRes.data.data.Chapters || (chaptersRes.data.data as any).chapters || [];
    }
  } catch (error) {
    console.error('Failed to fetch book data:', error);
  }
};

const loadReadingProgress = () => {
  const progress = localStorage.getItem(`read_progress_${bookId}`);
  if (progress) {
    lastReadChapter.value = JSON.parse(progress);
  }
};

const handleContinueReading = () => {
  if (lastReadChapter.value) {
    router.push(`/book/${bookId}/chapter/${lastReadChapter.value.id}`);
  } else if (chapters.value.length > 0) {
    router.push(`/book/${bookId}/chapter/${chapters.value[0].chapter_id}`);
  }
};

const handleChapterSelect = (chapter: BookChapterResponse) => {
  router.push(`/book/${bookId}/chapter/${chapter.chapter_id}`);
};

onMounted(() => {
  fetchBookData();
  loadReadingProgress();
});
</script>
