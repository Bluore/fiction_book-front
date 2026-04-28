<template>
  <n-modal
    v-model:show="showModal"
    preset="card"
    title="修改头像"
    class="avatar-upload-modal"
    style="width: 450px; max-width: calc(100% - 32px)"
    :segmented="{ content: 'soft', footer: 'soft' }"
    :mask-closable="!uploading"
    @after-leave="handleClosed"
  >
    <div class="modal-content">
      <div v-if="!imgSrc" class="upload-trigger" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
        <div class="trigger-inner">
          <n-icon size="48" class="upload-icon">
            <cloud-upload-outline />
          </n-icon>
          <p class="upload-text">点击或拖拽图片到此处上传</p>
          <p class="upload-hint">支持 JPG、PNG 格式，建议选择高分辨率图片</p>
        </div>
        <input ref="fileInput" type="file" accept="image/jpeg,image/png" class="hidden-input" @change="handleFileChange" />
      </div>

      <div v-else class="cropper-container">
        <div class="cropper-wrapper">
          <vue-cropper
            ref="cropper"
            :img="imgSrc"
            :output-size="1"
            output-type="png"
            :info="true"
            :full="true"
            :can-move="true"
            :can-move-box="true"
            :original="false"
            :auto-crop="true"
            :auto-crop-width="180"
            :auto-crop-height="180"
            :fixed="true"
            :fixed-number="[1, 1]"
            :center-box="true"
            :high="true"
            :info-true="true"
            :max-img-size="2000"
            :enlarge="1"
            :mode="'cover'"
          />
        </div>
        <div class="cropper-actions">
          <n-button secondary @click="resetUpload">重新选择</n-button>
          <div class="zoom-actions">
            <n-button circle secondary @click="changeScale(1)">
              <template #icon><n-icon><add-outline /></n-icon></template>
            </n-button>
            <n-button circle secondary @click="changeScale(-1)">
              <template #icon><n-icon><remove-outline /></n-icon></template>
            </n-button>
            <n-button circle secondary @click="rotateRight">
              <template #icon><n-icon><refresh-outline /></n-icon></template>
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <n-button :disabled="uploading" @click="showModal = false">取消</n-button>
        <n-button type="primary" :loading="uploading" :disabled="!imgSrc" @click="handleUpload">
          确认上传
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { CloudUploadOutline, AddOutline, RemoveOutline, RefreshOutline } from '@vicons/ionicons5';
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';
import { uploadAvatarApi } from '@/api/auth';

const emit = defineEmits(['success']);

const showModal = ref(false);
const uploading = ref(false);
const imgSrc = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const cropper = ref<any>(null);
const message = useMessage();

const open = () => {
  showModal.value = true;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    loadFile(files[0]);
  }
};

const handleDrop = (e: DragEvent) => {
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    loadFile(files[0]);
  }
};

const loadFile = (file: File) => {
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    message.error('只支持 JPG 或 PNG 格式的图片');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    imgSrc.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const resetUpload = () => {
  imgSrc.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const changeScale = (num: number) => {
  cropper.value?.changeScale(num);
};

const rotateRight = () => {
  cropper.value?.rotateRight();
};

const handleUpload = () => {
  if (!cropper.value) return;

  cropper.value.getCropBlob(async (blob: Blob) => {
    if (!blob) {
      message.error('裁剪失败，请重试');
      return;
    }

    // 创建一个 Image 对象来加载 blob
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    img.onload = async () => {
      // 创建 canvas 进行缩放
      const canvas = document.createElement('canvas');
      canvas.width = 180;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        message.error('浏览器不支持 Canvas');
        return;
      }

      // 绘制到 180x180 的 canvas
      ctx.drawImage(img, 0, 0, 180, 180);

      // 转换为 blob
      canvas.toBlob(async (resizedBlob) => {
        if (!resizedBlob) {
          message.error('压缩失败');
          return;
        }

        const fileName = `avatar_${Date.now()}.${resizedBlob.type === 'image/jpeg' ? 'jpg' : 'png'}`;
        const file = new File([resizedBlob], fileName, { type: resizedBlob.type });

        const formData = new FormData();
        formData.append('avatar', file);

        try {
          uploading.value = true;
          const res = await uploadAvatarApi(formData);
          if (res.data.code === 200) {
            message.success('头像修改成功');
            emit('success', res.data.data);
            showModal.value = false;
          } else {
            message.error(res.data.message || '上传失败');
          }
        } catch (error: any) {
          message.error(error.message || '上传失败，请稍后重试');
        } finally {
          uploading.value = false;
          URL.revokeObjectURL(img.src);
        }
      }, blob.type);
    };
    img.onerror = () => {
      message.error('图片加载失败');
      URL.revokeObjectURL(img.src);
    };
  });
};

const handleClosed = () => {
  resetUpload();
};

defineExpose({ open });
</script>

<style scoped>
.modal-content {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.upload-trigger {
  flex: 1;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
  min-height: 300px;
}

.upload-trigger:hover {
  border-color: var(--color-primary);
  background: #f0f0f0;
}

.trigger-inner {
  text-align: center;
  padding: 40px;
}

.upload-icon {
  color: #999;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.upload-hint {
  font-size: 14px;
  color: #999;
}

.hidden-input {
  display: none;
}

.cropper-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cropper-wrapper {
  width: 100%;
  height: 300px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.cropper-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.zoom-actions {
  display: flex;
  gap: 8px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
