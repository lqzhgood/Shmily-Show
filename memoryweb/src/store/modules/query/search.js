// query 搜索页面

import _ from 'lodash';
import Vue from 'vue';

import { sortSearchDictAndForm } from '@/common.js';
import { CONST_SEARCH_TYPE_MSG, CONST_SEARCH_TYPE_COMMENT } from '@/utils/const.js';

import {
    DEFAULT_SEARCH_FORM,
    searchFormIsSame,
    searchHandler,
    getCommentAllRelatedMsg,
    makeCanSearchArr,
} from '@/views/Query/components/SearchAndFilter/utils.js';

import MSG_DICT from '@/assets/data_pre/msg/msgDict.json';

export default {
    namespaced: true,
    state: () => ({
        MSG_DICT,
        loading: true, // 开始搜索时的 loading 状态默认为 true
        searchType: sessionStorage.STORE_SEARCH_TYPE || CONST_SEARCH_TYPE_MSG,
        searchKey: sessionStorage.STORE_SEARCH_KEY || '',
        searchForm: JSON.parse(sessionStorage.STORE_SEARCH_FORM || 'null') || _.cloneDeep(DEFAULT_SEARCH_FORM),
        currentPage: 1,
        pageSize: 20,
        rowExpansion: false,
        showSearchAndFilter: false,
    }),
    getters: {
        msgIsFilter(state) {
            const { searchType, searchKey, searchForm } = state;
            return searchType !== CONST_SEARCH_TYPE_MSG || searchKey || !searchFormIsSame(searchForm);
        },
        msgFilterData(state, getters, rootState, rootGetters) {
            const type = state.searchType;
            const key = state.searchKey;
            const form = state.searchForm;
            const search = { type, key, form };
            const canSearchArr = makeCanSearchArr(
                state.searchType,
                state.searchType === CONST_SEARCH_TYPE_MSG ? rootState.msgAll : rootState.commentAll,
            );
            // 一些搜索的优化;
            if (!key) {
                if (type === CONST_SEARCH_TYPE_MSG) {
                    if (searchFormIsSame(form)) {
                        return canSearchArr;
                    }
                } else if (type === CONST_SEARCH_TYPE_COMMENT) {
                    return getCommentAllRelatedMsg(rootState.msgAll, canSearchArr);
                }
            }

            let arr = searchHandler(canSearchArr, search, {});
            if (state.searchType === CONST_SEARCH_TYPE_MSG) {
                // 无需额外操作
            } else {
                arr = getCommentAllRelatedMsg(rootState.msgAll, arr);
            }

            return arr;
        },
    },
    mutations: {
        setLoading(state, v) {
            state.loading = v;
        },
        setSearchType(state, v) {
            const type = [CONST_SEARCH_TYPE_MSG, CONST_SEARCH_TYPE_COMMENT].includes(v) ? v : CONST_SEARCH_TYPE_MSG;
            state.searchType = type;
            sessionStorage.STORE_SEARCH_TYPE = type;
        },
        setSearchKey(state, v = '') {
            state.searchKey = v;
            if (v) {
                sessionStorage.STORE_SEARCH_KEY = v;
            } else {
                sessionStorage.removeItem('STORE_SEARCH_KEY');
            }
        },
        setSearchForm(state, form = null) {
            let f = form ? form : DEFAULT_SEARCH_FORM;
            // 赋值回来的要深拷贝 切断和组件中 localSearch 的联系
            f = sortSearchDictAndForm(_.cloneDeep(f), 'FORM');
            state.searchForm = f;

            if (!searchFormIsSame(f)) {
                sessionStorage.STORE_SEARCH_FORM = JSON.stringify(f);
            } else {
                sessionStorage.removeItem('STORE_SEARCH_FORM');
            }
        },
        setCurrentPage(state, v) {
            state.currentPage = v;
        },
        setPageSize(state, v) {
            state.pageSize = v;
        },
        toggleRowExpansion(state, on_off) {
            if (on_off === undefined) {
                state.rowExpansion = !state.rowExpansion;
            } else {
                state.rowExpansion = on_off;
            }
        },
        toggleShowSearchAndFilter(state, on_off) {
            if (on_off === undefined) {
                state.showSearchAndFilter = !state.showSearchAndFilter;
            } else {
                state.showSearchAndFilter = on_off;
            }
            // 关闭搜索页面时，将 loading 置为 true
            // 这样下次打开搜索页面 loading 初始值就为 true
            if (!state.showSearchAndFilter) {
                this.commit('query/search/setLoading', true);
            }
        },
    },
    actions: {
        async sendSearch({ state, getters, rootState, commit, dispatch }, { search = {}, id = null }) {
            const { type, key, form = null } = search;
            commit('setSearchType', type);
            commit('setSearchKey', key);
            commit('setSearchForm', form);
            await Vue.nextTick();
            if (id) {
                await dispatch('goToMsg', { id }, { root: true });
            } else {
                await dispatch('goToDay', { day: rootState.currDay }, { root: true });
            }
        },
    },
};
