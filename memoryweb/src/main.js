// import 'default-passive-events';
require('promise.prototype.finally').shim();

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './plugins/polyfill.js';
import './plugins/filter.js';
import './plugins/directive.js';
import './plugins/element.js';
import './plugins/dayjs.js';

import Contextmenu from '@lqzh/vue-context-menu';
Vue.use(Contextmenu);

import hevueImgPreview from 'hevue-img-preview';
import 'hevue-img-preview/css/theme-light.css';
Vue.use(hevueImgPreview, {
    keyboard: true,
    clickMaskCLose: true,
});

// 全局组件注册
import '@/components/index.js';
//  以下 html 标签视为自定义组件
//  - tag
//      comment html 里面用到
Vue.config.ignoredElements = ['tag'];

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
