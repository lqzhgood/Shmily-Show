import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index';

import { HASH_ROUTER } from '@/config';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/query',
    },
    {
        name: 'query',
        path: '/query',
        component: () => import('@/views/Query/index.vue'),
    },
    {
        name: 'statistic',
        path: '/statistic',
        component: () => import('@/views/Statistic/index.vue'),
        redirect: '/statistic/total',
        children: [
            {
                path: 'total',
                component: () => import('@/views/Statistic/Page/Total/index.vue'),
            },
            {
                path: 'contrast',
                component: () => import('@/views/Statistic/Page/Contrast/index.vue'),
            },
            {
                path: 'edit',
                component: () => import('@/views/Statistic/Page/Edit/index.vue'),
            },
            {
                path: `source/CallLog`,
                component: () => import(`@/views/Statistic/Page/Source/CallLog/index.vue`),
            },
            {
                path: encodeURI(`source/:sourceType`),
                component: () => import(`@/views/Statistic/Page/Source/COMMON/index.vue`),
            },
            {
                path: '*',
                redirect: '/statistic/all',
            },
        ],
    },
    {
        name: 'About',
        path: '/about',
        component: () => import(/* webpackChunkName: "about" */ '@/views/About/index.vue'),
    },
    {
        name: 'Dev',
        path: '/dev',
        component: () => import(/* webpackChunkName: "dev" */ '@/views/Dev/index.vue'),
        children: [
            {
                path: 'face/view',
                component: () => import('@/views/Dev/FaceView.vue'),
            },
            {
                path: 'face/md5',
                component: () => import('@/views/Dev/FaceMd5.vue'),
            },
            {
                path: 'file/time',
                component: () => import('@/views/Dev/FileTime.vue'),
            },
            {
                path: 'comment',
                component: () => import('@/views/Dev/Comment.vue'),
            },
        ],
    },
    {
        name: 'Refresh',
        path: '/refresh',
        component: () => import('@/views/PageRefresh.vue'),
    },
    {
        name: '404',
        path: '*',
        component: () => import('@/views/404/index.vue'),
    },
];

const router = new VueRouter({
    mode: HASH_ROUTER ? 'hash' : 'history',
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.path != from.path) store.commit('app/setIsPageLoading', true);
    next();
});

//  Email --> Email22 --> Email 不会触发 会导致 Loading 一直在，不过这种边界常规不会发生咯
router.afterEach((to, from) => {
    setTimeout(() => {
        if (to.path != from.path) store.commit('app/setIsPageLoading', false);
    }, 1000);
});

export default router;
