<template>
  <div class="book-editor paper-theme">
    <div class="content-container">
      <nav class="breadcrumb">
        <button class="text-btn underline" @click="goHome">首页</button>
        <span class="separator">/</span>
        <button class="text-btn underline" @click="goBack">创作中心</button>
        <span class="separator">/</span>
        <span class="current">{{ book?.name || '作品编辑' }}</span>
      </nav>

      <div class="editor-layout" v-if="book">
        <!-- Sidebar: Book Info -->
        <aside class="book-info-sidebar">
          <div class="sticky-content">
            <div class="cover-edit">
              <PaperBookCover :cover-image="book.cover_image" :width="184" :height="230" />
              <button class="text-btn underline mt-4" @click="handleChangeCover">修改封面</button>
            </div>
            
            <div class="form-group mt-8">
              <label>作品名称</label>
              <input type="text" v-model="book.name" class="paper-input" />
            </div>

            <div class="form-group">
              <label>作品简介</label>
              <textarea v-model="book.description" class="paper-textarea" rows="6"></textarea>
            </div>

            <button class="text-btn underline save-btn" @click="handleSaveBook">保存基本信息</button>
          </div>
        </aside>

        <!-- Main: Chapter Management -->
        <main class="chapter-management">
          <header class="section-header">
            <h2 class="section-title">目录管理</h2>
            <button class="text-btn underline" @click="handleAddChapter">添加章节</button>
          </header>

          <div class="chapter-list">
            <div v-for="chapter in chapters" :key="chapter.chapter_id" class="chapter-item">
              <div class="chapter-main-info">
                <span class="chapter-order">第 {{ chapter.order }} 章</span>
                <span class="chapter-title">{{ chapter.title }}</span>
              </div>
              <div class="chapter-meta">
                <span class="chapter-price">{{ chapter.price }} 点</span>
                <span class="chapter-vip">{{ getVipLabel(chapter.vip_level) }}</span>
              </div>
              <div class="chapter-actions">
                <button class="text-btn underline" @click="editChapter(chapter.chapter_id)">编辑内容</button>
                <button class="text-btn underline delete" @click="deleteChapter(chapter.chapter_id)">删除</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <CoverUploader 
      ref="uploaderRef" 
      :book-id="bookId" 
      @success="handleCoverSuccess" 
    />

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import PaperBookCover from '@/components/PaperBookCover/PaperBookCover.vue'
import CoverUploader from './components/CoverUploader.vue'
import Footer from '@/components/Footer/Footer.vue'
import { getBookDetailApi, getBookChaptersApi } from '@/api/book'
import { updateBookApi } from '@/api/creator'
import type { BookResponse, BookChapterResponse } from '@/api/book'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const bookId = route.params.id as string
const book = ref<BookResponse | null>(null)
const chapters = ref<BookChapterResponse[]>([])
const uploaderRef = ref<any>(null)

// VIP 等级映射关系
const VIP_LEVEL_MAP: Record<string, string> = {
  '': '游客可看',
  'vip_0': '免费',
  'vip_1': 'VIP',
  'vip_2': 'SVIP'
}

const getVipLabel = (value: string) => {
  return VIP_LEVEL_MAP[value] || value
}

const fetchData = async () => {
  try {
    const [bookRes, chaptersRes] = await Promise.all([
      getBookDetailApi(bookId),
      getBookChaptersApi(bookId)
    ])
    
    if (bookRes.data.code === 200) {
      book.value = bookRes.data.data
    }
    
    if (chaptersRes.data.code === 200) {
      chapters.value = chaptersRes.data.data.Chapters
    }
  } catch (error) {
    message.error('获取数据失败')
  }
}

const goBack = () => {
  router.push({ name: 'creator' })
}

const goHome = () => {
  router.push({ name: 'home' })
}

const handleSaveBook = async () => {
  if (!book.value) return
  try {
    const res = await updateBookApi(bookId, {
      name: book.value.name,
      description: book.value.description
    })
    if (res.data.code === 200) {
      message.success('保存成功')
    } else {
      message.error(res.data.message || '保存失败')
    }
  } catch (error) {
    message.error('保存失败')
  }
}

const handleChangeCover = () => {
  uploaderRef.value?.open()
}

const handleCoverSuccess = (url: string) => {
  if (book.value) {
    book.value.cover_image = url
  }
}

const handleAddChapter = () => {
  router.push({
    name: 'creator-chapter-editor',
    params: { id: bookId, chapterId: 'create' }
  })
}

const editChapter = (chapterId: string) => {
  router.push({ 
    name: 'creator-chapter-editor', 
    params: { id: bookId, chapterId } 
  })
}

const deleteChapter = (chapterId: string) => {
  chapters.value = chapters.value.filter(c => c.chapter_id !== chapterId)
  message.success('章节已删除')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped src="./BookEditor.css"></style>
