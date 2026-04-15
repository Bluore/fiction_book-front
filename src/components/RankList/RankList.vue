<template>
    <div class="rank-comp">
        <div class="rank-upper">
             <div class="title-box">
                 排行榜
             </div>
             <div class="rank-box">
                 <ul>
                     <li class="sort-option" @click="RefishRankListInfoByRead"><div class="sort-option-box">阅读</div></li>
                     <li class="sort-option" @click="RefishRankListInfoByStar"><div class="sort-option-box">收藏</div></li>
                     <li class="sort-option" @click="RefishRankListInfoByUpdate"><div class="sort-option-box">最新</div></li>
                 </ul>
             </div>
         </div>
         <div class="rank-line"></div>
         <div class="rank-content">
           <!-- 置顶书籍 -->
            <div class="top-card">
                <div class="top-card-left card">
                    <div class="img-warp">
                        <img src="https://picsum.photos/368/460?random=1" alt="测试书籍">
                    </div>
                    <div class="info-area">
                        <p class="info-title">霸道开发者爱上我</p>
                        <p class="info-desc">这本书籍介绍的是开发者沦陷进代码里面的故事</p>
                        <p class="info-read">阅读量：4.2k</p>
                        <p class="info-push">上架时间：2026-04-14</p>
                    </div>
                </div>
                <div class="book-division"></div>
                <div class="top-card-right card">
                    <div class="img-warp">
                        <img src="https://picsum.photos/368/460?random=2" alt="测试书籍">
                    </div>
                    <div class="info-area">
                        <p class="info-title">需求？</p>
                        <p class="info-desc">这本书籍看似就是用来占位置的，但实际上确实就是</p>
                        <p class="info-read">阅读量：2.9k</p>
                        <p class="info-push">上架时间：2026-04-13</p>
                    </div>
                </div>
            </div>
            <!-- 非置顶书籍 -->
            <ul class="rank-list">
                <li class="rank-card">
                    <span class="rank">3.</span>
                    <span class="info-title">测试书籍3</span>
                    <span class="info-desc">这本书籍看似就是用来占位置的，但实际上确实就是这本书籍看似就是用来占位置的，但实际上确实就是</span>
                </li>
                <li class="rank-card">
                    <span class="rank">4.</span>
                    <span class="info-title">测试书籍4</span>
                    <span class="info-desc">这本书籍看似就是用来占位置的，但实际上确实就是</span>
                </li>
                <li class="rank-card">
                    <span class="rank">5.</span>
                    <span class="info-title">测试书籍5</span>
                    <span class="info-desc">这本书籍看似就是用来占位置的，但实际上确实就是</span>
                </li>
                <li class="rank-card">
                    <span class="rank">6.</span>
                    <span class="info-title">这本书好看</span>
                    <span class="info-desc">这本书籍看似就是用来占位置的，但实际上确实就是</span>
                </li>
                <li class="rank-card">
                    <span class="rank">7.</span>
                    <span class="info-title">上本书不好看</span>
                    <span class="info-desc">这本书籍看似就是用来占位置的，但实际上确实就是</span>
                </li>
                <li class="rank-card">
                    <span class="rank">8.</span>
                    <span class="info-title">骗人的，我才好看</span>
                    <span class="info-desc">这本书籍看似就是用来占位置的</span>
                </li>
                <li class="rank-card">
                    <span class="rank">9.</span>
                    <span class="info-title">我不好看，不要读我</span>
                    <span class="info-desc">这本书籍看似就是用来占位置的</span>
                </li>
                <li class="rank-card">
                    <span class="rank">10.</span>
                    <span class="info-title">垫底书籍</span>
                    <span class="info-desc">这本书籍看似就是用来占位置的</span>
                </li>
            </ul>
         </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import './RankList.css'


const request = axios.create({
    baseURL: 'http://localhost:9929'
});

function RefishRankListInfoByRead(){
    RefishRankListInfo("browse_amount");
}
function RefishRankListInfoByStar(){
    RefishRankListInfo("bookshelf_amount");
}
function RefishRankListInfoByUpdate(){
    RefishRankListInfo("new_update");
}

function RefishRankListInfo(sortKey){
    request.get('/api/v1/books/list',{
        params: {
            page: 1,
            size: 10,
            sort_key: sortKey,
        }
    }).then(res=>{
        console.log(res.data);
    })
}

</script>
