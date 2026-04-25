<template>
  <div class="reading-page">
    <Header />
    
    <div class="page-wrap">
      <div class="reading-container paper-texture">
        <div class="reading-header">
          <div class="breadcrumb">
            <router-link :to="`/book/${bookId}`" class="back-link">
              <span class="back-icon">←</span> 返回书籍详情
            </router-link>
          </div>
          <h1 class="chapter-title">{{ chapter?.title || '加载中...' }}</h1>
          <div class="chapter-meta" v-if="chapter">
            <span>书名：{{ chapter.Book?.name }}</span>
            <span class="separator">|</span>
            <span>更新时间：{{ formatDate(chapter.Book?.updated_at) }}</span>
          </div>
        </div>

        <div class="reading-content" v-if="chapter">
          <div v-for="(p, index) in chapterContent" :key="index" class="paragraph">
            {{ p }}
          </div>
        </div>

        <div class="loading-state" v-else-if="loading">
          <n-spin size="large" />
          <p>正在努力加载内容...</p>
        </div>

        <div class="error-state" v-else>
          <p>{{ errorMsg }}</p>
          <n-button @click="fetchChapterData">重试</n-button>
        </div>

        <div class="reading-footer" v-if="chapter">
          <div class="nav-buttons">
            <n-button 
              text 
              class="nav-btn" 
              @click="goToChapter('prev')"
              :disabled="chapter.order <= 1"
            >
              上一章
            </n-button>
            <span class="nav-separator"></span>
            <n-button 
              text 
              class="nav-btn" 
              @click="goToChapter('next')"
            >
              下一章
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <Footer />

    <!-- 购买弹窗 -->
    <n-modal
      v-model:show="showPurchaseModal"
      preset="dialog"
      title="权限不足"
      :positive-text="chapterToPurchase?.price ? '确认购买' : '去充值'"
      negative-text="取消"
      @positive-click="handlePurchase"
    >
      <div class="purchase-info">
        <p class="purchase-msg">{{ purchaseMessage }}</p>
        
        <div v-if="chapterToPurchase?.price" class="price-detail">
          章节价格：<span class="gold-text">{{ chapterToPurchase.price }} 金豆</span>
        </div>

        <div class="recharge-tip">
          提示：如果余额不足或等级不够，请前往 <router-link to="/space" class="recharge-link">个人中心</router-link> 充值金豆或提升 VIP 等级。
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import Header from '@/components/Header/Header.vue';
import Footer from '@/components/Footer/Footer.vue';
import { 
  getChapterDetailApi, 
  getChapterDetailGuestApi, 
  buyChapterApi,
  getBookChaptersApi,
  type BookChapterResponse 
} from '@/api/book';
import { isLoggedIn } from '@/utils/auth';

const route = useRoute();
const router = useRouter();
const message = useMessage();

const bookId = ref(route.params.id as string);
const chapterId = ref(route.params.chapterId as string);

const chapter = ref<BookChapterResponse | null>(null);
const loading = ref(true);
const errorMsg = ref('');
const allChapters = ref<BookChapterResponse[]>([]);

const showPurchaseModal = ref(false);
const chapterToPurchase = ref<BookChapterResponse | null>(null);
const purchaseMessage = ref('');

// 处理章节内容分段
const chapterContent = computed(() => {
  if (!chapter.value?.content) return [];
  return chapter.value.content.split('\n').filter(p => p.trim() !== '');
});

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '未知';
  return new Date(dateStr).toLocaleDateString();
};

const handle4015Error = (errorData: any) => {
  // 4015 代表权限不足（未购买或 VIP 等级不足）
  chapterToPurchase.value = errorData.data;
  purchaseMessage.value = errorData.message || '该章节需要付费或提升会员等级后阅读';
  showPurchaseModal.value = true;
};

const fetchChapterData = async () => {
  loading.value = true;
  errorMsg.value = '';
  
  try {
    let res;
    if (isLoggedIn.value) {
      res = await getChapterDetailApi(chapterId.value);
    } else {
      res = await getChapterDetailGuestApi(chapterId.value);
    }

    if (res.data.code === 200) {
      chapter.value = res.data.data;
      updateReadingProgress();
    } else if (res.data.code === 4014) {
      // 需要登录
      message.warning('该章节需要登录后阅读');
      router.push({ name: 'login', query: { redirect: route.fullPath } });
    } else if (res.data.code === 4015) {
      handle4015Error(res.data);
    } else {
      errorMsg.value = res.data.message || '获取内容失败';
    }
  } catch (err: any) {
    console.error('Fetch chapter error:', err);
    // 拦截器可能会抛出错误对象（即响应体）
    const errorCode = err.code;
    if (errorCode === 4014) {
      message.warning('该章节需要登录后阅读');
      router.push({ name: 'login', query: { redirect: route.fullPath } });
    } else if (errorCode === 4015) {
      handle4015Error(err);
    } else {
      errorMsg.value = err.message || '网络错误，请稍后再试';
    }
  } finally {
    loading.value = false;
  }
};

const fetchAllChapters = async () => {
  try {
    const res = await getBookChaptersApi(bookId.value);
    if (res.data.code === 200) {
      allChapters.value = res.data.data.Chapters || [];
    }
  } catch (err) {
    console.error('Fetch all chapters error:', err);
  }
};

const updateReadingProgress = () => {
  if (!chapter.value) return;
  
  // 更新最近阅读章节
  const historyKey = `reading_history_${bookId.value}`;
  localStorage.setItem(historyKey, JSON.stringify({
    chapterId: chapter.value.chapter_id,
    title: chapter.value.title,
    time: new Date().getTime()
  }));

  // 更新已读列表
  const readKey = `read_list_${bookId.value}`;
  const readList = JSON.parse(localStorage.getItem(readKey) || '[]');
  if (!readList.includes(chapter.value.chapter_id)) {
    readList.push(chapter.value.chapter_id);
    localStorage.setItem(readKey, JSON.stringify(readList));
  }
};

const goToChapter = (direction: 'prev' | 'next') => {
  if (!chapter.value || allChapters.value.length === 0) return;
  
  const currentIndex = allChapters.value.findIndex(c => c.chapter_id === chapterId.value);
  if (currentIndex === -1) return;

  let targetChapter;
  if (direction === 'prev' && currentIndex > 0) {
    targetChapter = allChapters.value[currentIndex - 1];
  } else if (direction === 'next' && currentIndex < allChapters.value.length - 1) {
    targetChapter = allChapters.value[currentIndex + 1];
  }

  if (targetChapter) {
    router.push(`/book/${bookId.value}/chapter/${targetChapter.chapter_id}`);
  } else if (direction === 'next') {
    message.info('已经是最后一章了');
  }
};

const handlePurchase = async () => {
  // 如果没有价格信息，说明可能是纯 VIP 等级不足，直接引导去个人中心
  if (!chapterToPurchase.value?.price) {
    router.push('/space');
    return;
  }
  
  try {
    const res = await buyChapterApi({
      book_id: bookId.value,
      chapter_id: chapterToPurchase.value.chapter_id,
      price: chapterToPurchase.value.price
    });

    if (res.data.code === 200) {
      message.success('购买成功');
      showPurchaseModal.value = false;
      fetchChapterData();
    } else {
      message.error(res.data.message || '购买失败');
    }
  } catch (err: any) {
    const msg = err.response?.data?.message || '购买失败，请检查余额';
    message.error(msg);
  }
};

// 监听路由参数变化
watch(() => route.params.chapterId, (newId) => {
  if (newId) {
    chapterId.value = newId as string;
    fetchChapterData();
    // 自动滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

onMounted(() => {
  fetchChapterData();
  fetchAllChapters();
});
</script>

<style scoped src="./Reading.css"></style>
