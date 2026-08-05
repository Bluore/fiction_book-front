<template>
  <div v-if="show" class="confirm-dialog-overlay" @click.self="handleCancel">
    <div class="confirm-dialog-content raw-style">
      <h3 class="dialog-title">{{ title }}</h3>
      <div class="dialog-message">
        {{ message }}
      </div>
      <div class="dialog-actions">
        <button class="cancel-btn raw-btn" @click="handleCancel">{{ cancelText }}</button>
        <button class="confirm-btn raw-btn primary" @click="handleConfirm">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '提示' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },
});

const emit = defineEmits(['cancel', 'confirm']);

const handleCancel = () => emit('cancel');
const handleConfirm = () => emit('confirm');
</script>

<style scoped>
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 26, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(2px);
}

.confirm-dialog-content.raw-style {
  background: var(--color-bg);
  padding: 35px 30px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  border: 2px solid var(--color-secondary);
  border-radius: 2px;
  box-shadow: 6px 6px 0px rgba(92, 64, 51, 0.2);
  transform: rotate(-1deg);
  position: relative;
}

.confirm-dialog-content.raw-style::after {
  content: "";
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 1px dashed var(--color-border-hover);
  pointer-events: none;
  z-index: -1;
}

.dialog-title {
  font-family: var(--font-serif);
  font-size: var(--font-2xl);
  color: var(--color-primary);
  margin-bottom: 20px;
  font-weight: var(--font-bold);
  letter-spacing: 2px;
}

.dialog-message {
  font-size: var(--font-lg);
  color: var(--color-text);
  margin-bottom: 35px;
  line-height: var(--line-loose);
  font-family: var(--font-serif);
}

.dialog-actions {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.raw-btn {
  font-family: var(--font-serif);
  padding: 10px 24px;
  font-size: var(--font-base);
  font-weight: var(--font-bold);
  cursor: pointer;
  background: transparent;
  border: 2px solid var(--color-text);
  color: var(--color-text);
  transition: all 0.2s;
  box-shadow: 2px 2px 0px var(--color-text);
}

.raw-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px var(--color-text);
}

.raw-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px var(--color-text);
}

.raw-btn.primary {
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: 2px 2px 0px var(--color-primary);
}

.raw-btn.primary:hover {
  background: var(--color-primary-light);
  box-shadow: 3px 3px 0px var(--color-primary);
}

.raw-btn.primary:active {
  box-shadow: 0px 0px 0px var(--color-primary);
}
</style>
