import {createRouter, createWebHashHistory} from 'vue-router'


const Router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        name: 'home',
        component: () => import('@/views/home.vue'),

    }]
})

export default Router
