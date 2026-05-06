<template>
  <div class="create-book-page">
    <div class="content-container">
      <nav class="breadcrumb">
        <button class="text-btn underline" @click="goHome">首页</button>
        <span class="separator">/</span>
        <button class="text-btn underline" @click="goBack">创作中心</button>
        <span class="separator">/</span>
        <span class="current">新建作品</span>
      </nav>

      <div class="create-form-card paper-texture">
        <h2 class="form-title">基本信息</h2>
        
        <div class="form-item">
          <label class="form-label">作品名称</label>
          <n-input 
            v-model:value="form.name" 
            placeholder="请输入作品名称" 
            maxlength="20"
            show-count
            class="paper-input"
          />
        </div>

        <div class="form-item">
          <label class="form-label">作品价格</label>
          <n-input-number 
            v-model:value="form.price" 
            placeholder="请输入作品价格" 
            :min="0"
            :precision="0"
            class="paper-input"
          >
            <template #suffix>金豆</template>
          </n-input-number>
        </div>

        <div class="form-item">
          <label class="form-label">作品简介</label>
          <n-input 
            v-model:value="form.description" 
            type="textarea"
            placeholder="请输入作品简介" 
            :autosize="{ minRows: 5, maxRows: 10 }"
            maxlength="500"
            show-count
            class="paper-input"
          />
        </div>

        <div class="form-actions">
          <button class="text-btn underline secondary" @click="goBack">取消</button>
          <button 
            class="text-btn underline primary-btn" 
            :disabled="loading || !isFormValid" 
            @click="handleSubmit"
          >
            {{ loading ? '创建中...' : '确认创建' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { createBookApi } from '@/api/creator'

const router = useRouter()
const message = useMessage()
const loading = ref(false)

const form = ref({
  name: '',
  description: '',
  price: 0
})

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' && form.value.description.trim() !== ''
})

const goBack = () => {
  router.push({ name: 'creator' })
}

const goHome = () => {
  router.push({ name: 'home' })
}

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  try {
    const res = await createBookApi({
      name: form.value.name,
      description: form.value.description,
      price: form.value.price
    })
    
    if (res.data.code === 200) {
      message.success('作品创建成功')
      // 跳转到该作品的编辑页面
      router.push({ name: 'creator-book-editor', params: { id: res.data.data.id } })
    } else {
      message.error(res.data.message || '创建失败')
    }
  } catch (error) {
    console.error('创建作品失败:', error)
    message.error('创建作品失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-book-page {
  min-height: 100vh;
  padding: 40px 0;
  background-color: var(--color-bg);
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 40px;
}

.breadcrumb .separator {
  color: var(--color-text-muted);
}

.breadcrumb .current {
  color: var(--color-text-muted);
}

.create-form-card {
  background-color: var(--color-surface);
  padding: 40px;
  border: 1px dashed var(--color-border);
  position: relative;
}

.form-title {
  font-family: var(--font-serif);
  font-size: var(--font-2xl);
  margin-bottom: 32px;
  color: var(--color-text);
  border-left: 4px solid var(--color-primary);
  padding-left: 16px;
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.form-actions {
  margin-top: 48px;
  display: flex;
  justify-content: flex-end;
  gap: 24px;
}

.text-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: var(--font-base);
  color: var(--color-text);
  transition: all 0.3s ease;
}

.text-btn.underline {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.text-btn:hover {
  color: var(--color-primary);
}

.text-btn:disabled {
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.primary-btn {
  color: var(--color-primary);
  font-weight: var(--font-bold);
}

.secondary {
  color: var(--color-text-secondary);
}

/* 覆盖 Naive UI 样式以匹配纸张风格 */
:deep(.n-input), :deep(.n-input-number) {
  --n-border: 1px dotted var(--color-border) !important;
  --n-border-hover: 1px solid var(--color-primary) !important;
  --n-border-focus: 1px solid var(--color-primary) !important;
  --n-box-shadow-focus: none !important;
  background-color: transparent !important;
}

:deep(.n-input__border), :deep(.n-input-number__border) {
  border-style: dotted !important;
}
</style>
