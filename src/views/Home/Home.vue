<template>
    <Header />
   <div class="page-warp">
        <div class="page">
            <Carouse />
        </div>
    </div>
</template>

<script setup>
import Header from '@/components/Header/Header.vue'
import Carouse from '@/components/Carouse/Carouse.vue'
import './Home.css'
</script>