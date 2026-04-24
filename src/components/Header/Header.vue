<template>
  <header class="header-comp">
    <div class="header-inner">
      <!-- Logo -->
      <div class="logo-warp">
        <img src="https://picsum.photos/200/200" alt="文字小说" class="logo-img">
      </div>
      
      <!-- 导航栏 -->
      <nav class="nav-list">
        <div class="nav-item active">首页</div>
        <div class="nav-item">书库</div>
        <div class="nav-item">排行榜</div>
        <div class="nav-item">我的书架</div>
      </nav>

      <!-- 用户信息 -->
      <div class="user">
        <div class="user-profile-warp">
          <n-avatar round :size="40" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import './Header.css'
</script>
