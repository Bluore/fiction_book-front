<template>
  <div class="home-orders">
    <section class="paper-section">
      <div class="section-header">
        <h2 class="section-title">我的订单</h2>
      </div>

      <div v-if="loading" class="loading-state">
        加载中...
      </div>
      <div v-else-if="orders.length === 0" class="empty-state">
        暂无订单
      </div>
      <div v-else class="orders-content">
        <div class="orders-list">
          <div v-for="order in orders" :key="order.order_id" class="order-item">
            <div class="order-info">
              <div class="order-id">订单号：{{ order.order_id }}</div>
              <div class="order-time">创建时间：{{ formatDate(order.created_at) }}</div>
              <div class="order-price">价格：<span class="price-value">￥{{ (order.pay_price / 100).toFixed(2) }}</span></div>
            </div>
            <div class="order-status-actions">
              <div class="order-status" :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </div>
              <button 
                v-if="order.status === 1" 
                class="query-btn paper-btn" 
                @click="refreshOrderStatus(order.order_id)"
                :disabled="queryingId === order.order_id"
              >
                {{ queryingId === order.order_id ? '查询中...' : '查询状态' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="pagination-wrapper" v-if="totalCount > size">
          <n-pagination 
            v-model:page="currentPage" 
            :page-count="totalPages" 
            @update:page="handlePageChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getOrders, getOrder } from '@/api/order';
import { useMessage } from 'naive-ui';

const message = useMessage();
const orders = ref<any[]>([]);
const loading = ref(true);
const currentPage = ref(1);
const size = ref(10);
const totalCount = ref(0);
const queryingId = ref<string | null>(null);

const totalPages = computed(() => Math.ceil(totalCount.value / size.value));

const fetchOrders = async () => {
  try {
    loading.value = true;
    const res = await getOrders({ page: currentPage.value, size: size.value });
    if (res.data.code === 200) {
      orders.value = res.data.data.orders || [];
      totalCount.value = res.data.data.count || 0;
    } else {
      message.error(res.data.message || '获取订单失败');
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    message.error('获取订单异常');
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchOrders();
};

const refreshOrderStatus = async (orderId: string) => {
  if (queryingId.value) return;
  try {
    queryingId.value = orderId;
    const res = await getOrder(orderId);
    if (res.data.code === 200) {
      const updatedOrder = res.data.data;
      const index = orders.value.findIndex(o => o.order_id === orderId);
      if (index !== -1) {
        orders.value[index].status = updatedOrder.status;
      }
      message.success('状态已更新');
    } else {
      message.error(res.data.message || '查询失败');
    }
  } catch (error) {
    console.error('Failed to query order status:', error);
    message.error('查询异常');
  } finally {
    queryingId.value = null;
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString();
};

const getStatusText = (status: number) => {
  switch (status) {
    case 1: return '待付款';
    case 2: return '订单发货中';
    case 3: return '订单已完成';
    case -1: return '订单已被删除';
    case -2: return '超时未支付';
    default: return '未知状态';
  }
};

const getStatusClass = (status: number) => {
  switch (status) {
    case 1: return 'status-pending';
    case 2: return 'status-shipping';
    case 3: return 'status-completed';
    case -1: 
    case -2: return 'status-error';
    default: return 'status-default';
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.home-orders {
  padding-bottom: 20px;
}

.loading-state, .empty-state {
  padding: 40px;
  text-align: center;
  color: var(--color-text-muted);
  font-style: italic;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  transition: all 0.3s ease;
}

.order-item:hover {
  border-color: var(--color-text);
  box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.05);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.order-id {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}

.order-time {
  font-size: var(--font-sm);
  color: var(--color-text-muted);
}

.order-price {
  font-size: var(--font-base);
  color: var(--color-text);
}

.price-value {
  color: var(--color-primary);
  font-weight: var(--font-semibold);
  font-size: var(--font-lg);
}

.order-status-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-3);
}

.order-status {
  font-size: var(--font-sm);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-medium);
  border: 1px solid transparent;
}

.status-pending {
  color: var(--color-warning);
  border-color: var(--color-warning);
  background-color: rgba(194, 144, 51, 0.1);
}

.status-shipping {
  color: var(--color-info);
  border-color: var(--color-info);
  background-color: rgba(74, 107, 140, 0.1);
}

.status-completed {
  color: var(--color-success);
  border-color: var(--color-success);
  background-color: rgba(74, 124, 68, 0.1);
}

.status-error {
  color: var(--color-danger);
  border-color: var(--color-danger);
  background-color: rgba(176, 37, 37, 0.1);
}

.status-default {
  color: var(--color-text-muted);
  border-color: var(--color-text-muted);
  background-color: rgba(153, 153, 153, 0.1);
}

.paper-btn {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-text);
  padding: 6px 16px;
  cursor: pointer;
  font-size: var(--font-sm);
  transition: all 0.2s ease;
}

.paper-btn:hover:not(:disabled) {
  background-color: var(--color-text);
  color: var(--color-surface);
}

.paper-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-wrapper {
  margin-top: var(--space-6);
  display: flex;
  justify-content: center;
}
</style>
