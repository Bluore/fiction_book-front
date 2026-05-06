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
            path: '/space',
            name: 'space',
            component: () => import('@/views/UserSpace/UserSpace.vue')
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
            path: '/book/:id',
            name: 'book-detail',
            component: () => import('@/views/BookDetail/BookDetail.vue')
        },
        {
            path: '/book/:id/chapter/:chapterId',
            name: 'reading',
            component: () => import('@/views/Reading/Reading.vue')
        },
        {
            path: '/test',
            name: 'test',
            component: () => import('@/views/tester.vue')
        },
        {
            path: '/creator',
            name: 'creator',
            component: () => import('@/views/Creator/CreatorHome.vue')
        },
        {
            path: '/creator/book/create',
            name: 'creator-book-create',
            component: () => import('@/views/Creator/CreateBook.vue')
        },
        {
            path: '/creator/book/:id',
            name: 'creator-book-editor',
            component: () => import('@/views/Creator/BookEditor.vue')
        },
        {
            path: '/creator/book/:id/chapter/:chapterId',
            name: 'creator-chapter-editor',
            component: () => import('@/views/Creator/ChapterEditor.vue')
        }
    ]
})

export default router