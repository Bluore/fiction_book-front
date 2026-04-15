import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/tester.vue')
        },
        {
            path: '/test',
            name: 'test',
            component: () => import('../views/tester.vue')
        }
    ]
})

export default router