<template>
  <div class="search-bar-comp">
    <div class="search-input-wrapper">
      <input 
        type="text" 
        placeholder="搜索书籍、作者..." 
        class="search-input"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @keyup.enter="$emit('search', modelValue)"
      />
      <button class="search-btn-text" @click="$emit('search', modelValue)">搜索</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import './SearchBar.css';

defineProps<{
  modelValue?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value?: string): void
}>()
</script>
