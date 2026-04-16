<template>
    <div class="header-comp">
        <!-- Logo -->
       <div class="logo-warp">
            <img src="https://picsum.photos/200/200" alt="GSF小说" class="logo-img">
        </div>
        <!-- 导航栏 -->
        <div class="nav-list">
            <div class="nav-item">首页</div>
            <div class="nav-item">搜索</div>
            <div class="nav-item">书架</div>
        </div>
        <!-- 用户信息 -->
        <div class="user">
            <div class="user-profile-warp">
               <n-avatar :size="70" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
            </div>
        </div>
    </div>
</template>

<script setup>
import './Header.css'
import axios from 'axios';
import { ref } from 'vue';

const NavSelect = ref(1);


</script>