<template>
  <div class="home-profile">
    <section class="paper-section">
      <div class="section-header">
        <h2 class="section-title">账号信息</h2>
      </div>
      <div class="profile-form">
        <div class="form-item">
          <label>昵称</label>
          <input type="text" v-model="user.username" class="paper-input" />
        </div>
        <div class="form-item">
          <label>邮箱</label>
          <input type="email" v-model="user.email" class="paper-input" disabled />
          <span class="hint">邮箱不可修改</span>
        </div>
        <div class="form-item">
          <label>个人说明</label>
          <textarea v-model="user.description" class="paper-textarea" rows="4"></textarea>
        </div>
        <div class="form-actions">
          <button class="primary-text-btn" @click="handleSave" :disabled="saving">
            {{ saving ? '保存中...' : '保存修改' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { getUserInfoApi, updateUserInfoApi } from '@/api/auth';
import { useMessage } from 'naive-ui';

const message = useMessage();
const saving = ref(false);
const user = reactive({
  username: '',
  email: '',
  description: '',
  age: 0
});

const fetchUserInfo = async () => {
  try {
    const res = await getUserInfoApi();
    if (res.data.code === 200) {
      const data = res.data.data;
      user.username = data.username || '';
      user.email = data.email || '';
      user.description = data.description || '';
      user.age = data.age || 0;
    }
  } catch (error: any) {
    message.error(error.message || '获取用户信息失败');
  }
};

const handleSave = async () => {
  try {
    saving.value = true;
    const res = await updateUserInfoApi({
      username: user.username,
      description: user.description,
      age: user.age
    });
    
    if (res.data.code === 200) {
      message.success('保存成功');
    } else {
      message.error(res.data.message || '保存失败');
    }
  } catch (error: any) {
    message.error(error.message || '保存失败，请稍后重试');
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
.profile-form {
  max-width: 600px;
}

.form-item {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item label {
  font-weight: 500;
  color: #333;
}

.paper-input, .paper-textarea {
  border: none;
  border-bottom: 1px solid #d0c0a0;
  background: transparent;
  padding: 8px 0;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.paper-input:focus, .paper-textarea:focus {
  border-bottom-color: #333;
}

.hint {
  font-size: 12px;
  color: #999;
}

.form-actions {
  margin-top: 40px;
}

.primary-text-btn {
  background: #333;
  color: #fff;
  border: none;
  padding: 12px 32px;
  font-size: 16px;
  cursor: pointer;
}
</style>
