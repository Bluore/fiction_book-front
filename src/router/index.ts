import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/Home/Home.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login/Login.vue')
        },
        {
            path: '/library',
            name: 'library',
            component: () => import('@/views/BookLibrary/BookLibrary.vue')
        },
        {
            path: '/test',
            name: 'test',
            component: () => import('@/views/tester.vue')
        }
    ]
})

export default router