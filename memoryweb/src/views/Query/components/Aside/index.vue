<template>
    <aside :class="{ miniMode: miniMode }" class="test" id="aside">
        <AsideHeader :miniMode="miniMode" class="header" />
        <ul class="people">
            <li class="p">
                <div class="avatar">
                    <img :src="HEAD_INFOS.AVATAR_IMG.COME || '/static/avatar/default/come.png'" />
                    <div class="color away"></div>
                </div>
                <div class="info">
                    <div class="username">{{ HEAD_INFOS.HER_NAME }}</div>
                    <div class="text">{{ lastText }}</div>
                </div>
                <div class="time">{{ lastTime }}</div>
            </li>
        </ul>
        <div class="bottom">
            <Tips class="tips" v-show="msgIsFilter">
                <div @click="$store.commit('query/search/toggleShowSearchAndFilter', true)" class="text">
                    结果经过筛选
                </div>
                <div class="btns">
                    <el-popconfirm @confirm="clearFilter" title="确定清除筛选吗？">
                        <span slot="reference" title="清除筛选">❌</span>
                    </el-popconfirm>
                </div>
            </Tips>
            <div class="btns">
                <img @click="$router.push('/statistic')" class="Statistic" src="./assets/Statistic.png" title="统计" />
                <img @click="$router.push('/about')" class="about" src="./assets/about.png" title="关于" />
            </div>
        </div>
    </aside>
</template>
<script>
import { HEAD_INFOS } from '@/config.js';

import Tips from '@/components/Tips/index';
import Header from './components/Header/index.vue';

export default {
    name: 'Query-Aside',
    mounted() {
        this.miniMediaQuery = window.matchMedia('(max-width: 1000px)');
        this.minimize(this.miniMediaQuery);
        this.miniMediaQuery.addEventListener('change', this.minimize);
    },
    data: () => ({
        miniMode: false,
        miniMediaQuery: null,
        HEAD_INFOS,
    }),
    computed: {
        lastTime() {
            if (this.HEAD_INFOS.LAST_TIME) return this.HEAD_INFOS.LAST_TIME;
            if (this.msgAll.length === 0) return '-';
            const lastMsg = this.msgAll.slice(-1)[0];
            return `${lastMsg.day} ${lastMsg.time}`;
        },
        lastText() {
            return this.HEAD_INFOS.LAST_TEXT || 'Ok. Bye!';
        },
        msgAll() {
            return this.$store.state.msgAll;
        },
        msgIsFilter() {
            return this.$store.getters['query/search/msgIsFilter'];
        },
    },
    methods: {
        async clearFilter() {
            await this.$store.dispatch('query/search/sendSearch', { search: {}, id: null });
        },
        minimize(mql) {
            this.miniMode = mql.matches;
        },
    },
    components: {
        AsideHeader: Header,
        Tips,
    },
    beforeDestroy() {
        if (this.miniMediaQuery) {
            this.miniMediaQuery.removeEventListener('change', this.minimize);
        }
    },
};
</script>

<style lang="sass" scoped>
@import "./avatar.sass"

#aside
    flex: 0 0 300px
    display: flex
    flex-direction: column
    background-color: #2F373F
    transition: all 0.3s
    .people
        flex: 1 1 auto
        padding: 0 10px
        list-style-type: none
        overflow: auto
        .p
            display: flex
            justify-content: space-between
            align-items: flex-start
            color: #c0c0c0
            margin-bottom: 5px
            @include avatar
            .info
                flex: 1 1 auto
                padding-left: 20px
                .selected
                    border-bottom: 2px solid #fff
                .username
                    margin-top: 5px
                .text
                    font-size: 0.7em
            .time
                font-size: 0.6em
                flex-grow: 0.3
                padding-top: 10px
                text-align: right
    .bottom
        padding: 10px 10px 7px 10px
        .tips
            display: flex
            margin-bottom: 10px
            .text
                flex: 1 1 auto
                cursor: pointer
                &:hover
                    text-decoration: underline
            .btns
                cursor: pointer
                user-select: none
        .btns
            display: flex
            justify-content: space-between
            .Statistic,.about
                max-width: 25px
                vertical-align: bottom
                cursor: pointer

#aside.miniMode
    flex: 0 0 40px
    ::v-deep
        .header
            flex-direction: column
            .day
                margin: 10px 0
    .people
        justify-content: center
        .info,.time
            display: none
    .bottom
        text-align: center
        .tips
            flex-direction: column
</style>
