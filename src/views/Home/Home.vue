<template>
  <div class="home-view">
    <Header />
    
    <div class="page-warp">
      <div class="page">
        <!-- 搜索栏 -->
        <SearchBar />

        <!-- 首页轮番图 -->
        <Carouse />

        <!-- 热门推荐 -->
        <HotRecommend />

        <!-- 主内容区与侧栏 -->
        <div class="main-content-layout">
          <div class="left-section">
            <LatestWorks />
          </div>
          <aside class="right-sidebar">
            <RankList />
          </aside>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header/Header.vue'
import Carouse from '@/components/Carouse/Carouse.vue'
import SearchBar from '@/components/SearchBar/SearchBar.vue'
import HotRecommend from '@/components/HotRecommend/HotRecommend.vue'
import RankList from '@/components/RankList/RankList.vue'
import LatestWorks from '@/components/LatestWorks/LatestWorks.vue'
import Footer from '@/components/Footer/Footer.vue'
import './Home.css'
</script>
