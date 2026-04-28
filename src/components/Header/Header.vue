<template>
  <header class="header-comp">
    <div class="header-inner">
      <!-- Logo -->
      <div class="logo-warp">
        <img src="https://picsum.photos/200/200" alt="文字小说" class="logo-img">
      </div>
      
      <!-- 导航栏 -->
      <nav class="nav-list">
        <router-link to="/" class="nav-item" active-class="active">首页</router-link>
        <router-link to="/library" class="nav-item" active-class="active">书库</router-link>
        <div class="nav-item">排行榜</div>
        <div class="nav-item">我的书架</div>
      </nav>

      <!-- 用户信息 -->
      <div class="user">
        <router-link 
          v-if="!isLoggedIn" 
          to="/login" 
          class="nav-item" 
          active-class="active" 
          style="margin-right: 20px; font-size: var(--font-base);"
        >
          登录 / 注册
        </router-link>
        <div v-else class="user-profile-warp">
          <n-dropdown :options="userOptions" @select="handleSelect" trigger="hover">
            <div class="user-info-brief">
              <span class="username-text">{{ userInfo?.username }}</span>
              <n-avatar 
                round 
                :size="40" 
                :src="userInfo?.profile_image || 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'" 
              />
            </div>
          </n-dropdown>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { isLoggedIn, userInfo, setUserInfo, logout } from '@/utils/auth'
import { getUserInfoApi } from '@/api/auth'
import { useMessage, NIcon } from 'naive-ui'
import { LogOutOutline, PersonOutline } from '@vicons/ionicons5'
import './Header.css'

const router = useRouter()
const message = useMessage()

const renderIcon = (icon: any) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const userOptions = [
  {
    label: '个人中心',
    key: 'space',
    icon: renderIcon(PersonOutline)
  },
  {
    label: '创作中心',
    key: 'creator',
    icon: renderIcon(PersonOutline) // Using PersonOutline for now, can change if needed
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutOutline)
  }
]

const handleSelect = (key: string) => {
  if (key === 'logout') {
    logout()
    message.success('已安全退出登录')
    router.push('/login')
  } else if (key === 'space') {
    router.push('/space')
  } else if (key === 'creator') {
    router.push('/creator')
  }
}

onMounted(async () => {
  if (isLoggedIn.value && !userInfo.value) {
    try {
      const res = await getUserInfoApi()
      if (res.data.code === 200 || res.data.code === 0) {
        setUserInfo(res.data.data)
      }
    } catch (err) {
      console.error('获取用户信息失败:', err)
      // 如果获取信息失败（如 token 过期），则登出
      logout()
    }
  }
})
</script>
