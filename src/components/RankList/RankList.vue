<template>
    <div class="rank-comp">
        <div class="rank-upper">
             <div class="title-box">
                 排行榜
             </div>
             <div class="rank-box">
                 <ul>
                     <li class="sort-option" :class="{select: RankKeySelect===1}"  @click="RefishRankListInfoByRead"><div class="sort-option-box">阅读</div></li>
                     <li class="sort-option" :class="{select: RankKeySelect===2}" @click="RefishRankListInfoByStar"><div class="sort-option-box">收藏</div></li>
                     <li class="sort-option" :class="{select: RankKeySelect===3}" @click="RefishRankListInfoByUpdate"><div class="sort-option-box">最新</div></li>
                 </ul>
             </div>
         </div>
         <div class="rank-line"></div>
         <div class="rank-content">
           <!-- 置顶书籍 -->
            <div class="top-card">
                <div class="top-card-left card" @click="OpenBookLinkByOrder(0)">
                    <div class="img-warp">
                        <img :src="RankList[0]?.cover_image" alt="{{ RankList[0]?.name }}">
                    </div>
                    <div class="info-area">
                        <p class="info-title">{{ RankList[0]?.name }}</p>
                        <p class="info-desc">{{ RankList[0]?.description }}</p>
                        <p class="info-read">阅读量：{{ RankList[0]?.browse_amount }}</p>
                        <p class="info-push">上架时间：{{ RankList[0]?.created_at }}</p>
                    </div>
                </div>
                <div class="book-division"></div>
                <div class="top-card-right card" @click="OpenBookLinkByOrder(1)">
                    <div class="img-warp">
                        <img :src="RankList[1]?.cover_image" alt="{{ RankList[1]?.name }}">
                    </div>
                    <div class="info-area">
                        <p class="info-title">{{ RankList[1]?.name }}</p>
                        <p class="info-desc">{{ RankList[1]?.description }}</p>
                        <p class="info-read">阅读量：{{ RankList[1]?.browse_amount }}</p>
                        <p class="info-push">上架时间：{{ RankList[1]?.created_at }}</p>
                    </div>
                </div>
            </div>
            <!-- 非置顶书籍 -->
            <ul class="rank-list">
                <li v-for="index in 8" :key="index" class="rank-card" @click="OpenBookLinkByOrder(1+index)">
                    <span class="rank">{{ 2+index }}.</span>
                    <span class="info-title">{{ RankList[1+index]?.name }}</span>
                    <span class="info-desc">{{ RankList[1+index]?.description }}</span>
                </li>
            </ul>
         </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import './RankList.css'

const RankList = ref([])
const RankKeySelect = ref(3)

const request = axios.create({
    baseURL: 'http://localhost:9929'
});

RefishRankListInfoByUpdate();

function RefishRankListInfoByRead(){
    RankKeySelect.value = 1;
    RefishRankListInfo("browse_amount");
}
function RefishRankListInfoByStar(){
    RankKeySelect.value = 2;
    RefishRankListInfo("bookshelf_amount");
}
function RefishRankListInfoByUpdate(){
    RankKeySelect.value = 3;
    RefishRankListInfo("new_update");
}

// 刷新排行榜列表
function RefishRankListInfo(sortKey){
    request.get('/api/v1/books/list',{
        params: {
            page: 1,
            size: 10,
            sort_key: sortKey,
        }
    }).then(res=>{
        // console.log(res.data);
        RankList.value = res.data['data']['books'];
    })
}

function OpenBookLinkByOrder(index){
    console.log("Open Book: ",RankList.value[index].id);
    console.log("Book Name: ",RankList.value[index].name);
}

</script>
