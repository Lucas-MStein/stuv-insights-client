// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import InsightsPage from '../pages/InsightsPage.vue'

const routes = [
    {
        path: '/',
        name: 'insights',
        component: InsightsPage,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router