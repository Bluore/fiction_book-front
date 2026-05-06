<template>
  <div class="user-space paper-theme">
    <UserSpaceHeader v-if="userInfo" :user="userInfo" />
    
    <div class="content-container">
      <!-- Tab Navigation -->
      <nav class="home-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </nav>

      <!-- Content Area -->
      <main class="tab-content">
        <component :is="activeComponent" />
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import UserSpaceHeader from './components/UserSpaceHeader.vue'
import Footer from '@/components/Footer/Footer.vue'
import { mockUser } from '@/mocks/user'
import { getUserInfoApi } from '@/api/auth'
import { userInfo, setUserInfo } from '@/utils/auth'
import './UserSpace.css'

const activeTab = ref('overview')

const tabs = [
  { id: 'overview', name: '概览' },
  { id: 'recent', name: '最近在读' },
  { id: 'bookshelf', name: '我的书架' },
  { id: 'profile', name: '我的信息' },
  { id: 'recharge', name: '充值' }
]

const activeComponent = computed(() => {
  switch (activeTab.value) {
    case 'overview': return defineAsyncComponent(() => import('./components/HomeOverview.vue'))
    case 'recent': return defineAsyncComponent(() => import('./components/HomeRecent.vue'))
    case 'bookshelf': return defineAsyncComponent(() => import('./components/HomeBookshelf.vue'))
    case 'profile': return defineAsyncComponent(() => import('./components/HomeProfile.vue'))
    case 'recharge': return defineAsyncComponent(() => import('./components/HomeRecharge.vue'))
    default: return defineAsyncComponent(() => import('./components/HomeOverview.vue'))
  }
})

const fetchUserInfo = async () => {
  try {
    const res = await getUserInfoApi()
    if (res.data.code === 200) {
      setUserInfo(res.data.data)
    } else {
      setUserInfo(mockUser)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    setUserInfo(mockUser)
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>
