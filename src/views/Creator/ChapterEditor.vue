<template>
  <div class="chapter-editor paper-theme">
    <header class="editor-header">
      <div class="header-left">
        <button class="text-btn underline" @click="goHome">首页</button>
        <span class="separator">/</span>
        <button class="text-btn underline" @click="goBack">返回作品</button>
        <span class="separator">|</span>
        <input type="text" v-model="chapter.title" class="title-input" placeholder="请输入章节标题" />
      </div>
      <div class="header-right">
        <div class="settings-trigger" @click="showSettings = !showSettings">
          <button class="text-btn underline">章节设置</button>
        </div>
        <button 
          class="text-btn underline save-btn" 
          :disabled="saving" 
          @click="handleSave"
        >
          {{ saving ? '保存中...' : '保存修改' }}
        </button>
      </div>
    </header>

    <main class="editor-main">
      <textarea 
        v-model="chapter.content" 
        class="content-textarea" 
        placeholder="在这里开始你的创作..."
        @input="handleInput"
      ></textarea>
      
      <div class="word-count">
        字数：{{ wordCount }}
      </div>
    </main>

    <!-- Settings Sidebar (Overlay) -->
    <Transition name="slide">
      <div v-if="showSettings" class="settings-panel">
        <header class="panel-header">
          <h3>章节设置</h3>
          <button class="text-btn" @click="showSettings = false">×</button>
        </header>
        
        <div class="panel-content">
          <div class="form-group">
            <label>价格 (点数)</label>
            <input type="number" v-model="chapter.price" class="paper-input" />
          </div>

          <div class="form-group">
            <label>所需 VIP 等级</label>
            <select v-model="chapter.vip_level" class="paper-select">
              <option v-for="opt in VIP_LEVEL_OPTIONS" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { getChapterDetailApi } from '@/api/book'
import { updateChapterApi } from '@/api/creator'
import type { BookChapterResponse } from '@/api/book'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const bookId = route.params.id as string
const chapterId = route.params.chapterId as string

const chapter = ref<BookChapterResponse>({
  chapter_id: chapterId,
  title: '',
  content: '',
  order: 0,
  vip_level: 'free',
  price: 0
})

const showSettings = ref(false)
const saving = ref(false)

// VIP 等级映射关系
const VIP_LEVEL_OPTIONS = [
  { label: '游客可看', value: '' },
  { label: '免费', value: 'vip_0' },
  { label: 'VIP', value: 'vip_1' },
  { label: 'SVIP', value: 'vip_2' }
]

const getVipLabel = (value: string) => {
  return VIP_LEVEL_OPTIONS.find(opt => opt.value === value)?.label || value
}

const fetchData = async () => {
  try {
    const res = await getChapterDetailApi(chapterId)
    if (res.data.code === 200) {
      chapter.value = res.data.data
    }
  } catch (error) {
    message.error('获取章节失败')
  }
}

const wordCount = computed(() => {
  return chapter.value.content?.length || 0
})

const goBack = () => {
  router.push({ name: 'creator-book-editor', params: { id: bookId } })
}

const goHome = () => {
  router.push({ name: 'home' })
}

const handleSave = async () => {
  if (!chapter.value.title.trim()) {
    message.warning('请输入章节标题')
    return
  }
  
  saving.value = true
  try {
    const res = await updateChapterApi(chapterId, {
      id: chapterId,
      title: chapter.value.title,
      content: chapter.value.content || '',
      price: chapter.value.price,
      vip_level: chapter.value.vip_level
    })
    
    if (res.data.code === 200) {
      message.success('保存成功')
    } else {
      message.error(res.data.message || '保存失败')
    }
  } catch (error) {
    console.error('保存章节失败:', error)
    message.error('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

const handleInput = () => {
  // Can implement auto-save logic here
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped src="./ChapterEditor.css"></style>
