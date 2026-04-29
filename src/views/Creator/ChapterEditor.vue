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
          {{ saving ? (isCreateMode ? '创建中...' : '保存中...') : (isCreateMode ? '章节创建' : '保存修改') }}
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
import { createChapterApi, updateChapterApi } from '@/api/creator'
import type { BookChapterResponse } from '@/api/book'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const bookId = route.params.id as string
const chapterId = ref(route.params.chapterId as string)
const isCreateMode = computed(() => chapterId.value === 'create')

const chapter = ref<BookChapterResponse>({
  chapter_id: chapterId.value,
  title: '',
  content: '',
  order: 0,
  vip_level: '',
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
  if (isCreateMode.value) return
  
  try {
    const res = await getChapterDetailApi(chapterId.value)
    if (res.data.code === 200) {
      chapter.value = res.data.data
      chapter.value.vip_level = chapter.value.vip_level ?? ''
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
    if (isCreateMode.value) {
      // 创建模式
      const res = await createChapterApi({
        book_id: bookId,
        title: chapter.value.title,
        content: chapter.value.content || '',
        price: Number(chapter.value.price) || 0,
        vip_level: chapter.value.vip_level || ''
      })
      
      if (res.data.code === 200) {
        message.success('章节创建成功')
        // 创建成功后切换到编辑模式
        chapterId.value = res.data.data.chapter_id
        chapter.value = res.data.data
        // 更新路由参数但不刷新页面，保持在当前编辑状态
        router.replace({ 
          name: 'creator-chapter-editor', 
          params: { id: bookId, chapterId: chapterId.value } 
        })
      } else {
        message.error(res.data.message || '创建失败')
      }
    } else {
      // 更新模式
      const res = await updateChapterApi(chapterId.value, {
        id: chapterId.value,
        title: chapter.value.title,
        content: chapter.value.content || '',
        price: Number(chapter.value.price) || 0,
        vip_level: chapter.value.vip_level || ''
      })
      
      if (res.data.code === 200) {
        message.success('保存成功')
      } else {
        message.error(res.data.message || '保存失败')
      }
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
