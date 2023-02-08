import { Message } from 'element-ui';
import dayjs from 'dayjs';
import Vuex from 'vuex';
import Vue from 'vue';
import router from '../router/index.js';

import { STEP_LENGTH } from '@/config.js';
import { FORMAT_TIME, CONSOLE_STYLE, MATCH_ID_REG } from '@/utils/const.js';

import App from './modules/app';
import Dev from './modules/dev';
import Query from './modules/query/index.js';
import QuerySearch from './modules/query/search.js';

import mode from '@/assets/data_pre/mode.json';

Vue.use(Vuex);

const _DEFAULT_DAY = '2009/09/13 23:42:34';

const store = new Vuex.Store({
    state: {
        mode,
        currDay: _DEFAULT_DAY,
        msgAll: [],
        commentAll: [],
        sLength: 0,
        eLength: 0,
    },
    getters: {
        hasCommentMode(state) {
            return state.mode.includes('comment');
        },
        hasModifyMode(state) {
            return state.mode.includes('modify');
        },
        msgIsMax(state, getters) {
            return state.eLength >= getters.msgShow.length;
        },
        msgShow(state, getters) {
            return getters['query/search/msgIsFilter'] ? getters['query/search/msgFilterData'] : state.msgAll;
        },
        msgPart(state, getters) {
            CONSOLE_STYLE.success(
                '当前阅读进度',
                `${((state.sLength / state.msgAll.length) * 100).toFixed(2)} % ${state.sLength}/${state.msgAll.length}`,
            );
            return getters.msgShow.slice(state.sLength, state.eLength);
        },
    },
    mutations: {
        setMsgAllAndCommentAll(state, { msgAll, commentAll }) {
            state.msgAll = msgAll;
            state.commentAll = commentAll;
        },
        setSLength(state, num) {
            state.sLength = num;
        },
        setELength(state, num) {
            state.eLength = num;
        },
        setCurrDay(state, time) {
            state.currDay = dayjs(time).format(FORMAT_TIME);
        },
    },
    actions: {
        async sendMsgFilterData({ state, commit, dispatch }, { msgArr = null, id = null }) {
            // 如果长度一致,说明传过来的是 msgAll
            if (msgArr && msgArr.length === state.msgAll.length) {
                msgArr = null;
            }

            if (!msgArr) {
                commit('query/search/setSearchForm', null);
            }

            commit('setMsgFilterData', msgArr);
            await Vue.nextTick();
            if (id) {
                await dispatch('goToMsg', { id });
            } else {
                await dispatch('goToDay', { day: state.currDay });
            }
        },
        async goToMsg({ state, getters, commit, dispatch }, { id = null }) {
            const msgShow = getters.msgShow;

            const msgIsFilter = getters['query/search/msgIsFilter'];
            const tips = msgIsFilter ? ' 去掉筛选试试' : '';
            try {
                if (!id || !MATCH_ID_REG.test(id)) throw new Error(`ID无效 ${id}`);
                let msgIndex = msgShow.findIndex(v => v.id === id);

                if (msgIndex === -1) {
                    // 可能是 msgId 被修改了, 试着跳到对应的时间
                    try {
                        const str = id.match(MATCH_ID_REG)[1];
                        const [d, t] = str.split('_');
                        const ms = new Date(`${d} ${t.replaceAll('-', ':')}`).getTime();
                        msgIndex = msgShow.findIndex(v => v.ms >= ms);
                        if (msgIndex === -1) {
                            throw new Error(`没找找到 ${id}` + tips);
                        } else {
                            Message.warning(`无法找到 ${id}，已切换至最近时间` + tips);
                        }
                    } catch (error) {
                        // 时间无法找到 那就报错吧
                        throw new Error(`没有找到 ${id}` + tips);
                    }
                }

                const realMsg = msgShow[msgIndex];

                commit('setCurrDay', realMsg.ms);
                await Vue.nextTick();
                await dispatch('scrollMsg', { msgIndex });
            } catch (error) {
                Message.error({
                    showClose: true,
                    duration: 0,
                    message: error.message,
                    async onClose() {
                        if (msgIsFilter) {
                            dispatch('query/search/sendSearch', { search: {} });
                        }
                        await Vue.nextTick();
                        router.replace({ path: '/refresh', query: {} });
                    },
                });
            }
        },
        async goToDay({ state, getters, commit, dispatch }, { day = null }) {
            const msgShow = getters.msgShow;
            let msgIndex = 0;
            if (dayjs(day).isValid() && msgShow.length > 0) {
                const _ms = dayjs(day).valueOf();
                if (msgShow[0].ms > _ms) msgIndex = 0;
                else if (msgShow.slice(-1)[0].ms < _ms) msgIndex = msgShow.length - 1;
                else msgIndex = msgShow.findIndex(v => v.ms >= _ms);
                const realMsg = msgShow[msgIndex];
                if (dayjs(day).format('YYYY-MM-DD') !== `${realMsg.day}`) {
                    Message.warning(`无法找到 ${day} 的消息，已切换至最近时间 ${realMsg.day} ${realMsg.time}`);
                }
                commit('setCurrDay', realMsg.ms);
            }
            await dispatch('scrollMsg', { msgIndex });
            // 如果没有找到就使用默认的 msgIndex=0 跳到第一条
        },
        async scrollMsg({ state, commit }, { msgIndex }) {
            commit('setSLength', msgIndex);
            commit('setELength', msgIndex + STEP_LENGTH);

            await Vue.nextTick();
            commit('query/setScrollToPosition', 'top');
        },
    },
    modules: {},
});
store.registerModule('app', App);
store.registerModule('query', Query);
store.registerModule(['query', 'search'], QuerySearch);

if (store.getters['app/isDev']) {
    store.registerModule('dev', Dev);
}

export default store;
