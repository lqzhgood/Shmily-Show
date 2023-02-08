<template>
    <div id="query">
        <LoadingDiv class="container" :loading="loading">
            <QueryAside />
            <QueryMain />
            <SearchAndFilter v-if="showSearchAndFilter" />
        </LoadingDiv>
    </div>
</template>

<script>
import dayjs from 'dayjs';

import Aside from './components/Aside/';
import Main from './components/Main/';
import SearchAndFilter from './components/SearchAndFilter/';

import axiosJson from '@/plugins/axios-json';
import { deepFreeze } from '@/utils/index.js';
import {
    FORMAT_TIME_URL,
    FORMAT_TIME,
    CONSOLE_STYLE,
    MATCH_ID_REG,
    CONST_SEARCH_TYPE_MSG,
    CONST_SEARCH_TYPE_COMMENT,
} from '@/utils/const.js';

import { DEFAULT_URL_DAY } from '@/config';

export default {
    name: 'Query-Home',
    async mounted() {
        await this.downMsgAndComment();
        this.$store.commit('app/setInitOk');
        this.openSearch();
    },
    data: () => ({
        loading: false,
    }),
    computed: {
        hasCommentMode() {
            return this.$store.getters.hasCommentMode;
        },
        showSearchAndFilter() {
            return this.$store.state.query.search.showSearchAndFilter;
        },
    },
    watch: {
        async '$route.query.day'(day) {
            // 如果是 URL 时间格式则不处理， 因为滚动时会更新 url 避免循环
            if (dayjs(day, FORMAT_TIME_URL, true).isValid()) return;

            if (MATCH_ID_REG.test(day)) {
                await this.goToQueryId(day);
            } else {
                await this.goToQueryDay(day, false);
            }
        },
    },
    methods: {
        openSearch() {
            const { searchType = CONST_SEARCH_TYPE_MSG, searchKey = '' } = this.$route.query;

            if (!searchKey || ![CONST_SEARCH_TYPE_MSG, CONST_SEARCH_TYPE_COMMENT].includes(searchType)) return;
            this.$store.commit('query/search/toggleShowSearchAndFilter', true);
        },
        async downMsgAndComment() {
            if (this.loading) return;
            this.loading = true;

            const _this = this;

            function commitProgress(progress) {
                const url = new URL(progress.target.responseURL);

                // Gzip 时 total 可能为 0,
                // 也可能是 Gzip 后的大小(这时 loaded 可能是实际大小) 导致 total 小于 loaded
                const total = progress.total > progress.loaded ? progress.total : progress.loaded;

                _this.$store.commit('app/setInitProgress', {
                    pathname: url.pathname,
                    progress: Math.round((progress.loaded / total) * 100),
                    loaded: progress.loaded,
                    total,
                });
            }

            const getMsg = axiosJson.get('/msg/msg.json', { onDownloadProgress: commitProgress });
            const getComment = this.hasCommentMode
                ? axiosJson.get('/comment/comments.json', { onDownloadProgress: commitProgress })
                : [];

            const [Msg_JSON, Comment_JSON] = await Promise.all([getMsg, getComment]);

            const mFreeze = deepFreeze(Msg_JSON);
            const cFreeze = deepFreeze(Comment_JSON);

            _this.$store.commit('setMsgAllAndCommentAll', { msgAll: mFreeze, commentAll: cFreeze });
            await _this.$nextTick();

            const { id, day } = _this.$route.query;
            if (id || MATCH_ID_REG.test(day)) {
                await _this.goToQueryId(id || day);
            } else {
                await _this.goToQueryDay(day);
            }

            await this.$nextTick();
            this.loading = false;
        },
        async goToQueryId(id) {
            await this.$store.dispatch('goToMsg', { id });
        },
        async goToQueryDay(day = DEFAULT_URL_DAY, autoDefault = true) {
            const _this = this;
            // 上次阅读位置优先 然后再使用 Url 标记时间
            const lastCurrDay = localStorage.lastCurrDay;
            CONSOLE_STYLE.info('上次阅读位置', lastCurrDay);

            const strArr = day.split('_');
            const _d = /^[1-2]\d{3}-[0-1]?\d-[0-3]?\d$/.test(strArr[0]) ? strArr[0] : null;
            const _t = /^[0-2]?\d-[0-6]?\d-[0-6]?\d$/.test(strArr[1]) ? strArr[1] : null;
            const _day = `${_d}_${_t}`;

            let findDay;

            if (dayjs(_day, FORMAT_TIME_URL, true).isValid()) {
                // 标准时间格式
                CONSOLE_STYLE.info('标准时间格式', _day);
                findDay = dayjs(_day, FORMAT_TIME_URL);
            } else if (dayjs(day, 'YYYY-MM-DD HH-mm-ss').isValid()) {
                findDay = dayjs(day, 'YYYY-MM-DD HH-mm-ss');
                CONSOLE_STYLE.info('兼容时间格式 YYYY-MM-DD HH-mm-ss', day + ' ' + findDay.format(FORMAT_TIME));
            } else if (day && dayjs(day).isValid()) {
                // 任意可以被识别的时间格式  时间戳转换为 Number 类型
                findDay = dayjs(/^\d+$/.test(day) ? Number(day) : day);
                CONSOLE_STYLE.info('兼容时间格式', day + ' ' + findDay.format(FORMAT_TIME));
            } else {
                this.$message.error(`时间格式错误 ${_d}_${_t}`);
                if (autoDefault) {
                    findDay = dayjs(DEFAULT_URL_DAY, FORMAT_TIME_URL);
                    CONSOLE_STYLE.danger('错误的时间格式', day);
                } else {
                    findDay = null;
                }
            }
            if (!findDay) return;

            await this.$store.dispatch('goToDay', { day: findDay.format(FORMAT_TIME) });

            if (lastCurrDay && dayjs(lastCurrDay).isValid()) {
                this.$notify({
                    type: 'success',
                    title: '上次阅读位置',
                    dangerouslyUseHTMLString: true,
                    duration: 30 * 1000,
                    message: `<p style="cursor: pointer"><span style="margin-right:10px">🚀</span>${lastCurrDay}</p>`,
                    async onClick() {
                        await _this.$store.dispatch('goToDay', { day: lastCurrDay });
                        this.close();
                    },
                });
            }
        },
    },
    components: {
        QueryAside: Aside,
        QueryMain: Main,
        SearchAndFilter,
    },
};
</script>

<style lang="sass" scoped>
#query
    width: 100vw
    height: 100vh
    display: flex
    justify-content: center
    align-items: center
    background-color: #caeaf7
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    background: radial-gradient(rgba(0,0,0,0), rgba(0, 0, 0, 0.3)), url('./assets/wallhaven-49z2w0.jpg')
    .container
        // max-width: 1000px
        width: 90%
        height: 90%
        display: flex
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2)
        min-width: 600px
        margin-left: -60px // VerticalDatePicker
</style>
