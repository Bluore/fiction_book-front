<template>
  <div class="home-recharge">
    <!-- G币充值 -->
    <section class="paper-section">
      <div class="section-header">
        <h2 class="section-title">充值 G币</h2>
      </div>
      <div class="recharge-grid">
        <div 
          v-for="amount in presetAmounts" 
          :key="amount"
          class="recharge-card"
          :class="{ active: selectedAmount === amount }"
          @click="selectedAmount = amount"
        >
          <div class="g-coin-icon">G</div>
          <div class="amount-text">{{ amount }} 个</div>
          <div class="price-text">￥{{ (amount / 100).toFixed(2) }}</div>
        </div>
        <div 
          class="recharge-card custom-card"
          :class="{ active: selectedAmount === 'custom' }"
          @click="selectedAmount = 'custom'"
        >
          <div class="amount-text">自定义数量</div>
          <input 
            v-if="selectedAmount === 'custom'"
            v-model="customAmount"
            type="number"
            class="custom-input"
            placeholder="输入金额"
            @click.stop
          />
        </div>
      </div>
      <div class="recharge-footer">
        <button class="primary-text-btn" @click="handleRechargeClick">立即充值</button>
      </div>
    </section>

    <PaymentDialog
      :show="showPaymentDialog"
      :reward-gold="dialogRewardGold"
      :price="dialogPrice"
      @cancel="handlePaymentCancel"
      @confirm="handlePaymentConfirm"
    />

    <ConfirmDialog
      :show="showVipConfirmDialog"
      title="VIP 操作确认"
      :message="vipConfirmMessage"
      @cancel="handleVipCancel"
      @confirm="executeVipAction"
    />

    <!-- Polling Status Display -->
    <div v-if="isPolling" class="polling-overlay">
      <div class="polling-content">
        <h3>正在等待支付结果...</h3>
        <p>{{ pollingMessage }}</p>
        <p>订单ID: {{ currentOrderId }}</p>
        <p>请在新打开的页面完成支付。</p>
      </div>
    </div>

    <!-- VIP 购买 -->
    <section class="paper-section">
      <div class="section-header">
        <h2 class="section-title">购买 VIP</h2>
      </div>
      <div class="vip-grid">
        <div 
          v-for="plan in vipPlans" 
          :key="plan.id"
          class="vip-card"
        >
          <div class="vip-duration">{{ plan.name }}</div>
          <div class="vip-price">{{ plan.price }} G币</div>
          <ul class="vip-benefits">
            <li v-for="benefit in plan.benefits" :key="benefit">{{ benefit }}</li>
          </ul>
          <button class="text-btn" @click="handleVipAction(plan)">{{ plan.actionText }}</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMessage } from 'naive-ui';
import PaymentDialog from '@/components/PaymentDialog.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { 
  createGoldOrder, 
  getOrder, 
  getVipShopApi, 
  buyVipApi,
  upgradeVipApi,
  type VipShopItem 
} from '@/api/order';

const message = useMessage();
const presetAmounts = [600, 1000, 5000, 100000];
const selectedAmount = ref<number | 'custom'>(600);
const customAmount = ref<number | null>(null);

const showPaymentDialog = ref(false);
const dialogRewardGold = ref(0);
const dialogPrice = ref(0);

// Polling related states
const isPolling = ref(false);
const pollingMessage = ref('正在查询订单状态...');
const currentOrderId = ref<string | null>(null);
let pollingIntervalId: number | null = null;
let pollingTimeoutId: number | null = null;
const POLLING_INTERVAL = 3000; // Poll every 3 seconds
const POLLING_TIMEOUT = 120 * 1000; // Stop polling after 2 minutes

const handleRechargeClick = () => {
  let rewardGold = 0;
  if (selectedAmount.value === 'custom') {
    rewardGold = customAmount.value || 0;
  } else {
    rewardGold = selectedAmount.value;
  }

  if (rewardGold <= 0) {
    message.warning('充值金额必须大于0');
    return;
  }

  dialogRewardGold.value = rewardGold;
  dialogPrice.value = rewardGold / 100; // price in CNY, can be float

  showPaymentDialog.value = true;
};

const startPolling = (orderId: string) => {
  currentOrderId.value = orderId;
  isPolling.value = true;
  pollingMessage.value = '正在查询订单状态...';

  pollingIntervalId = setInterval(async () => {
    try {
      const response = await getOrder(orderId);
      if (response.data.code === 200) {
        const status = response.data.data.status;
        if (status !== 1) { // 1 is pending payment
          stopPolling();
          if (status === 3) {
            message.success('支付成功！');
            // Optionally, refresh user info or G-coin balance
          } else if (status === -1) {
            message.warning('订单已被取消。');
          } else if (status === -2) {
            message.warning('订单超时未支付。');
          } else {
            message.info(`订单状态: ${status}`);
          }
        } else {
          pollingMessage.value = '订单待支付，请在新页面完成支付...';
        }
      } else {
        pollingMessage.value = `查询订单失败: ${response.data.message}`;
      }
    } catch (error: any) {
      pollingMessage.value = `查询订单失败: ${error.message || '未知错误'}`;
    }
  }, POLLING_INTERVAL);

  pollingTimeoutId = setTimeout(() => {
    stopPolling();
    message.warning('长时间未支付，订单查询已停止。');
  }, POLLING_TIMEOUT);
};

const stopPolling = () => {
  if (pollingIntervalId) {
    clearInterval(pollingIntervalId);
    pollingIntervalId = null;
  }
  if (pollingTimeoutId) {
    clearTimeout(pollingTimeoutId);
    pollingTimeoutId = null;
  }
  isPolling.value = false;
  currentOrderId.value = null;
};

const handlePaymentConfirm = async () => {
  try {
    const response = await createGoldOrder({
      price: dialogPrice.value,
      reward_gold: dialogRewardGold.value,
    });
    if (response.data.code === 200) {
      const payUrl = response.data.data.pay_url;
      const orderId = response.data.data.order_id;
      window.open(payUrl, '_blank');
      message.success('订单创建成功，请在新页面完成支付。');
      startPolling(orderId);
    } else {
      message.error(`订单创建失败: ${response.data.message}`);
    }
  } catch (error: any) {
    message.error(`支付失败: ${error.message || '未知错误'}`);
  }
  showPaymentDialog.value = false;
};

const handlePaymentCancel = () => {
  showPaymentDialog.value = false;
};

onUnmounted(() => {
  stopPolling();
});

const rawVipPlans = ref<VipShopItem[]>([]);

const fetchVipShop = async () => {
  try {
    const response = await getVipShopApi();
    if (response.data.code === 200) {
      rawVipPlans.value = response.data.data.shop || [];
    } else {
      console.error('获取VIP商品列表失败:', response.data.message);
    }
  } catch (error) {
    console.error('获取VIP商品列表发生错误:', error);
  }
};

onMounted(() => {
  fetchVipShop();
});

const vipPlans = computed(() => {
  return rawVipPlans.value.map((plan, index) => {
    let name = '';
    let benefits: string[] = [];
    let actionText = '';

    // 解析名字和权益
    if (plan.vip_level === 'vip_1') {
      name = plan.duration === 'year' ? '年度会员' : '月度会员';
      benefits = plan.duration === 'year' 
        ? ['全站免费阅读', '专属标识', '三倍经验', '每月礼包']
        : ['全站免费阅读', '专属标识', '双倍经验'];
    } else if (plan.vip_level === 'vip_2') {
      name = plan.duration === 'year' ? '年度超级会员' : '月度超级会员';
      benefits = plan.duration === 'year'
        ? ['全站免费阅读', '超级专属标识', '十倍经验', '专属客服', '节日豪礼']
        : ['全站免费阅读', '超级专属标识', '五倍经验', '专属客服'];
    }

    // 解析按钮文字
    if (plan.type === 'buy') {
      actionText = `购买${name}`;
    } else if (plan.type === 'renew') {
      actionText = `续费${name}`;
    } else if (plan.type === 'upgrade') {
      actionText = `升级为${name}`;
    }

    return {
      id: `${plan.type}_${plan.vip_level}_${plan.duration || 'none'}_${index}`,
      type: plan.type,
      name,
      price: plan.price,
      benefits,
      actionText,
      originalData: plan
    };
  });
});

const showVipConfirmDialog = ref(false);
const vipConfirmMessage = ref('');
const pendingVipPlan = ref<any>(null);

const handleVipAction = (plan: any) => {
  pendingVipPlan.value = plan;
  vipConfirmMessage.value = `确定要花费 ${plan.price} G币${plan.actionText}吗？`;
  showVipConfirmDialog.value = true;
};

const handleVipCancel = () => {
  showVipConfirmDialog.value = false;
  pendingVipPlan.value = null;
};

const executeVipAction = async () => {
  const plan = pendingVipPlan.value;
  if (!plan) return;
  showVipConfirmDialog.value = false;

  try {
    if (plan.type === 'upgrade') {
      const response = await upgradeVipApi({
        original_vip_level: 'vip_1',
        target_vip_level: plan.originalData.vip_level,
        price: plan.price
      });
      if (response.data.code === 200) {
        message.success(`${plan.actionText}成功！`);
        fetchVipShop();
      } else {
        message.error(`${plan.actionText}失败: ${response.data.message}`);
      }
    } else {
      // buy or renew
      const response = await buyVipApi({
        duration: plan.originalData.duration,
        price: plan.price,
        vip_level: plan.originalData.vip_level
      });
      if (response.data.code === 200) {
        message.success(`${plan.actionText}成功！`);
        fetchVipShop();
      } else {
        message.error(`${plan.actionText}失败: ${response.data.message}`);
      }
    }
  } catch (error: any) {
    message.error(`${plan.actionText}失败: ${error.message || '未知错误'}`);
  }
};
</script>

<style scoped>
.recharge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.recharge-card {
  border: 1px dashed #d0c0a0;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.5);
}

.recharge-card:hover {
  background: #fff;
  border-style: solid;
  border-color: #333;
}

.recharge-card.active {
  background: #fff;
  border-style: solid;
  border-color: #333;
  box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.1);
}

.g-coin-icon {
  width: 40px;
  height: 40px;
  background: #f1c40f;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-weight: bold;
}

.amount-text {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
}

.price-text {
  color: #888;
  font-size: 14px;
}

.custom-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #333;
  background: transparent;
  padding: 4px;
  text-align: center;
  margin-top: 8px;
  outline: none;
}

.recharge-footer {
  text-align: right;
}

.primary-text-btn {
  background: #333;
  color: #fff;
  border: none;
  padding: 12px 32px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.primary-text-btn:hover {
  opacity: 0.9;
}

/* VIP Grid */
.vip-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.vip-card {
  border: 1px solid #333;
  padding: 30px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.vip-card::before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  right: -5px;
  bottom: -5px;
  border: 1px dashed #d0c0a0;
  z-index: -1;
}

.vip-duration {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.vip-price {
  font-size: 24px;
  color: #e67e22;
  margin-bottom: 24px;
}

.vip-benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
  text-align: center;
  width: 100%;
}

.vip-benefits li {
  padding: 8px 0;
  border-bottom: 1px dotted #eee;
  font-size: 14px;
  color: #666;
}

.text-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
  font-weight: 500;
}

.polling-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.polling-content {
  background: var(--color-surface);
  padding: 30px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 400px;
  text-align: center;
  color: var(--color-text);
}

.polling-content h3 {
  font-size: var(--font-xl);
  margin-bottom: 15px;
}

.polling-content p {
  margin-bottom: 10px;
}

.polling-content p:last-child {
  margin-bottom: 0;
}
</style>
