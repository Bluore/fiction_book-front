<template>
  <div class="user-space-header" :style="{ backgroundImage: `url(${user.cover_image})` }">
    <div class="header-mask"></div>
    <!-- Home Button -->
    <router-link to="/" class="back-home-btn">
      <span class="home-text">返回首页</span>
    </router-link>
    <div class="header-content">
      <div class="user-basic-info">
        <div class="avatar-wrapper" @click="handleAvatarClick">
          <img :src="user.profile_image" :alt="user.username" class="user-avatar" />
          <div class="avatar-hover-overlay">
            <span class="hover-text">修改头像</span>
          </div>
        </div>
        <div class="text-info">
          <div class="name-vip">
            <h1 class="username">{{ user.username }}</h1>
            <span v-if="user.vip_level > 0" class="vip-badge">VIP {{ user.vip_level }}</span>
          </div>
          <p class="description">{{ user.description || '暂无个人说明' }}</p>
        </div>
      </div>
      
      <div class="user-stats">
        <div class="stat-item">
          <span class="stat-label">G币</span>
          <span class="stat-value">{{ user.gold }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-label">阅读字数</span>
          <span class="stat-value">{{ formatWords(user.read_words_num) }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-label">阅读书籍</span>
          <span class="stat-value">{{ user.read_books_num }}</span>
        </div>
      </div>
    </div>
    
    <AvatarUploadModal ref="avatarModal" @success="handleAvatarSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { UserInfo } from '@/utils/auth';
import AvatarUploadModal from './AvatarUploadModal.vue';
import { setUserInfo } from '@/utils/auth';

const props = defineProps<{
  user: UserInfo;
}>();

const avatarModal = ref<any>(null);

const handleAvatarClick = () => {
  avatarModal.value?.open();
};

const handleAvatarSuccess = (userData: any) => {
  setUserInfo(userData);
};

const formatWords = (words: number | undefined | null) => {
  if (words === undefined || words === null) return '0';
  if (words >= 10000) {
    return (words / 10000).toFixed(1) + '万';
  }
  return words.toString();
};
</script>

<style scoped>
.user-space-header {
  height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-end;
  color: white;
  overflow: hidden;
}

.header-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7));
  z-index: 1;
}

.back-home-btn {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  padding: 6px 12px;
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.4);
  transition: all 0.3s;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Source Han Serif", "Songti SC", "SimSun", serif;
  letter-spacing: 2px;
}

.back-home-btn:hover {
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
}

.home-text {
  font-size: 15px;
  text-decoration: underline;
  text-underline-offset: 6px;
  font-weight: 300;
}

.header-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 20px;
}

.user-basic-info {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  min-width: 300px;
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.avatar-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-wrapper:hover .avatar-hover-overlay {
  opacity: 1;
}

.hover-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name-vip {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.username {
  font-size: 28px;
  margin: 0;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.vip-badge {
  background: var(--color-accent);
  color: var(--color-secondary);
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.description {
  font-size: 14px;
  opacity: 0.9;
  margin: 0 0 8px 0;
  max-width: 400px;
}

.vip-expiry {
  font-size: 12px;
  opacity: 0.7;
}

.user-stats {
  display: flex;
  gap: 40px;
  background: rgba(0, 0, 0, 0.3);
  padding: 16px 32px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  margin-left: auto;
}

@media (max-width: 768px) {
  .user-space-header {
    height: auto;
    min-height: 300px;
    padding-top: 60px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 20px 20px;
  }
  
  .user-basic-info {
    flex-direction: column;
    min-width: unset;
  }
  
  .name-vip {
    justify-content: center;
  }
  
  .user-stats {
    margin-left: 0;
    width: 100%;
    justify-content: center;
    gap: 20px;
    padding: 12px;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
}

.stat-divider {
  width: 1px;
  height: 30px;
  border-left: 1px dotted rgba(255, 255, 255, 0.5);
  align-self: center;
}
</style>
