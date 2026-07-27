<template>
  <div v-if="show" class="payment-dialog-overlay">
    <div class="payment-dialog-content">
      <h3 class="dialog-title">确认充值</h3>
      <div class="dialog-item">
        <span class="item-label">充值G币数量:</span>
        <span class="item-value">{{ rewardGold }} 个</span>
      </div>
      <div class="dialog-item">
        <span class="item-label">支付金额:</span>
        <span class="item-value">￥{{ price.toFixed(2) }}</span>
      </div>
      <div class="dialog-item">
        <span class="item-label">支付方式:</span>
        <span class="item-value">支付宝</span>
      </div>
      <div class="dialog-actions">
        <button class="cancel-btn" @click="$emit('cancel')">取消</button>
        <button class="confirm-btn" @click="$emit('confirm')">去支付</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  rewardGold: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['cancel', 'confirm']);
</script>

<style scoped>
.payment-dialog-overlay {
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

.payment-dialog-content {
  background: var(--color-surface);
  padding: 30px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.dialog-title {
  font-size: var(--font-xl);
  color: var(--color-text);
  margin-bottom: 20px;
  font-weight: var(--font-semibold);
}

.dialog-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: var(--font-base);
}

.item-label {
  color: var(--color-text-secondary);
}

.item-value {
  color: var(--color-primary);
  font-weight: var(--font-semibold);
}

.dialog-actions {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}

.cancel-btn,
.confirm-btn {
  padding: 10px 25px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-base);
  transition: all 0.3s;
}

.cancel-btn {
  background: var(--color-border);
  color: var(--color-text-secondary);
}

.cancel-btn:hover {
  background: #d0c0a0;
}

.confirm-btn {
  background: var(--color-primary);
  color: #fff;
}

.confirm-btn:hover {
  background: var(--color-primary-hover);
}
</style>
