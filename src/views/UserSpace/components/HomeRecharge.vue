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
        <button class="primary-text-btn">立即充值</button>
      </div>
    </section>

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
          <button class="text-btn">立即购买</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const presetAmounts = [600, 1000, 5000, 100000];
const selectedAmount = ref<number | 'custom'>(600);
const customAmount = ref<number | null>(null);

const vipPlans = [
  {
    id: 'month',
    name: '月度会员',
    price: 3000,
    benefits: ['全站免费阅读', '专属标识', '双倍经验']
  },
  {
    id: 'quarter',
    name: '季度会员',
    price: 8000,
    benefits: ['全站免费阅读', '专属标识', '三倍经验', '每月礼包']
  },
  {
    id: 'year',
    name: '年度会员',
    price: 28000,
    benefits: ['全站免费阅读', '专属标识', '五倍经验', '专属客服', '节日豪礼']
  }
];
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
</style>
