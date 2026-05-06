<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="card"
    title="修改封面"
    class="cover-uploader-modal paper-texture"
    style="width: 600px"
    @after-leave="handleAfterLeave"
  >
    <div class="uploader-content">
      <div v-if="!imgSrc" class="upload-placeholder" @click="triggerFileInput">
        <div class="placeholder-text">
          <p>点击选择图片</p>
          <p class="hint">仅支持 JPG，尺寸将裁剪为 368x460</p>
        </div>
      </div>
      
      <div v-else class="cropper-container">
        <div class="cropper-wrapper">
          <vue-cropper
            ref="cropperRef"
            :img="imgSrc"
            :outputSize="1"
            outputType="jpg"
            :info="false"
            :canScale="true"
            :autoCrop="true"
            :autoCropWidth="368"
            :autoCropHeight="460"
            :fixed="true"
            :fixedNumber="[368, 460]"
            :fixedBox="false"
            :centerBox="true"
            :high="true"
            :enlarge="1"
            mode="cover"
          />
        </div>
        <div class="cropper-actions">
          <button class="text-btn underline" @click="triggerFileInput">重选图片</button>
        </div>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg"
        style="display: none"
        @change="handleFileChange"
      />
    </div>

    <template #footer>
      <div class="modal-footer">
        <button class="text-btn underline secondary" @click="showModal = false">取消</button>
        <button 
          class="text-btn underline primary-btn" 
          :disabled="!imgSrc || uploading" 
          @click="handleUpload"
        >
          {{ uploading ? '上传中...' : '确认上传' }}
        </button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { uploadBookCoverApi } from '@/api/creator'

const props = defineProps<{
  bookId: string
}>()

const emit = defineEmits<{
  (e: 'success', url: string): void
}>()

const showModal = ref(false)
const uploading = ref(false)
const imgSrc = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const cropperRef = ref<any>(null)
const message = useMessage()

const open = () => {
  showModal.value = true
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.type !== 'image/jpeg') {
    message.error('仅支持上传 JPG 格式的图片')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    imgSrc.value = event.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleUpload = () => {
  if (!cropperRef.value) return

  uploading.value = true
  // 获取裁剪后的 Base64 数据，然后通过 Canvas 进行二次缩放
  cropperRef.value.getCropData(async (data: string) => {
    try {
      // 创建 Image 对象加载裁剪后的图
      const img = new Image()
      img.src = data
      img.onload = async () => {
        // 创建 Canvas 进行强制缩放
        const canvas = document.createElement('canvas')
        canvas.width = 368
        canvas.height = 460
        const ctx = canvas.getContext('2d')
        
        if (ctx) {
          // 绘制缩放后的图像
          ctx.drawImage(img, 0, 0, 368, 460)
          
          // 导出为 Blob
          canvas.toBlob(async (blob) => {
            if (!blob) {
              message.error('图片处理失败')
              uploading.value = false
              return
            }

            const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' })
            const res = await uploadBookCoverApi(props.bookId, file)
            
            if (res.data.code === 200) {
              message.success('封面上传成功')
              emit('success', res.data.data.cover_url)
              showModal.value = false
            } else {
              message.error(res.data.message || '上传失败')
            }
            uploading.value = false
          }, 'image/jpeg', 0.9)
        }
      }
      img.onerror = () => {
        message.error('图片加载失败')
        uploading.value = false
      }
    } catch (error) {
      console.error('上传封面失败:', error)
      message.error('上传封面失败，请稍后重试')
      uploading.value = false
    }
  })
}

const handleAfterLeave = () => {
  imgSrc.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

defineExpose({ open })
</script>

<style scoped>
.uploader-content {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.upload-placeholder {
  flex: 1;
  border: 2px dashed var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 400px;
}

.upload-placeholder:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg);
}

.placeholder-text {
  text-align: center;
  color: var(--color-text-secondary);
}

.hint {
  font-size: var(--font-xs);
  margin-top: 8px;
  color: var(--color-text-muted);
}

.cropper-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cropper-wrapper {
  height: 460px;
  width: 100%;
  background-color: #f0f0f0;
}

.cropper-actions {
  display: flex;
  justify-content: center;
}

.modal-footer {
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

:deep(.n-card-header__main) {
  font-family: var(--font-serif) !important;
}
</style>
