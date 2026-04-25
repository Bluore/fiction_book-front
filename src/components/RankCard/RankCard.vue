<template>
  <div class="rank-card" @click="$emit('click')">
    <span class="rank">{{ rank }}.</span>
    <span class="info-title">{{ book?.name || '书名占位符' }}</span>
    <span class="info-desc">{{ book?.description || '描述占位符' }}</span>
  </div>
</template>

<script setup lang="ts">
import type { BookResponse } from '../../api/book';
import './RankCard.css';

defineProps<{
  rank: number;
  book?: BookResponse;
}>();

defineEmits(['click']);
</script>
