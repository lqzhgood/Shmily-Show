<template>
    <div class="sidebar">
        <div class="profile">
            <div class="profile-img">
                <a href="/index.html">
                    <img src="./logo.png" />
                </a>
            </div>
        </div>
        <div class="main-menu">
            <router-link active-class="active" class="menu-item" custom to="/statistic/total" v-slot="{ navigate }">
                <div @click="navigate">
                    <i class="menu-icon el-icon-data-analysis"></i>
                    <p class="menu-text">总体概况</p>
                </div>
            </router-link>
            <router-link active-class="active" class="menu-item" custom to="/statistic/contrast" v-slot="{ navigate }">
                <div @click="navigate">
                    <i class="menu-icon el-icon-coordinate"></i>
                    <p class="menu-text">双方对比</p>
                </div>
            </router-link>
            <router-link
                active-class="active"
                class="menu-item"
                custom
                to="/statistic/edit"
                v-slot="{ navigate }"
                v-if="hasCommentMode && hasModifyMode"
            >
                <div @click="navigate">
                    <i class="menu-icon el-icon-edit"></i>
                    <p class="menu-text">评论与修改</p>
                </div>
            </router-link>
            <router-link
                :key="s"
                :to="`/statistic/Source/${encodeURI(s)}`"
                active-class="active"
                class="menu-item"
                custom
                v-for="s in ALL_SOURCE"
                v-slot="{ navigate }"
            >
                <div @click="navigate">
                    <i class="menu-icon">
                        <img :src="`/static/icon/source/${s}.png`" class="source-icon" />
                    </i>
                    <p class="menu-text">{{ s }}</p>
                </div>
            </router-link>
        </div>
        <div class="expand-button">
            <i class="el-icon-arrow-right"></i>
        </div>
    </div>
</template>
<script>
import ALL_SOURCE from '@/assets/data_pre/statistic/Msg/ALL_SOURCE.json';

export default {
    name: 'Page-Statistic-Component-Sidebar',
    data: () => ({
        ALL_SOURCE: [...ALL_SOURCE],
    }),
    computed: {
        hasCommentMode() {
            return this.$store.getters.hasCommentMode;
        },
        hasModifyMode() {
            return this.$store.getters.hasModifyMode;
        },
    },
    methods: {},
};
</script>
<style lang="sass" scoped>
.sidebar
    height: 95vh
    width: 60px
    background-color: #111
    border-radius: 10px
    overflow: hidden
    z-index: 999
    transition: all 0.2s ease
    transform-origin: left center
    &:hover
        box-shadow: 0 10px 20px #111
    *
        padding: 0
        margin: 0
        box-sizing: border-box
        outline: 0
    a
        text-decoration: none
    img
        height: auto
        width: 100%
    li
        list-style: none
    *::-webkit-scrollbar
        display: none
    .profile
        display: grid
        place-items: center
        height: 60px
        width: 100%
        background-color: #222
        font-size: 20px
        color: #fff
        margin-bottom: 5px
        img
            display: grid
            place-items: center
            height: 40px
            width: 40px
            background-color: #364f6b
            border-radius: 50%
            cursor: pointer

    .main-menu
        width: 100%
        align-items: center
        display: flex
        flex-direction: column
        .menu-item
            color: #fff
            position: relative
            margin: 5px 0
            height: 40px
            width: 40px
            display: grid
            place-items: center
            border-radius: 5px
            transition: all 0.2s linear
            cursor: pointer
            &.active
                background-color: #333333
            &:hover
                transform-origin: left center
                transform: scale(1.2)
            i.menu-icon
                font-size: 15px
                cursor: pointer
                .source-icon
                    max-width: 20px
            .menu-text
                white-space: nowrap
                display: none

    .expand-button
        position: absolute
        bottom: 0
        display: grid
        place-items: center
        height: 30px
        width: 100%
        font-size: 20px
        color: #fff
        background-color: #222
        i
            position: absolute
            top: -50%
            right: 10px
            display: grid
            place-items: center
            height: 40px
            width: 40px
            background-color: #364f6b
            border: 5px #222 solid
            border-radius: 50%
            cursor: pointer
            transition: all 0.2s linear
            transform-origin: center center
.sidebar:hover
    width: 250px
    z-index: 9999
    .main-menu
        .menu-item
            display: flex
            align-items: center
            justify-content: flex-start
            width: 90%
            a
                display: flex
                align-items: center
                justify-content: space-between
                text-align: left
            i
                margin: 15px
            .menu-text
                display: block
    .expand-button i
        transform: rotate(-180deg)
        position: absolute
        right: 10px
</style>
