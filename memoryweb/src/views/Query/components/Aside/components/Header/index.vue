<template>
    <header class="header">
        <div class="avatar">
            <img alt="avatar" :src="HEAD_INFOS.AVATAR_IMG.GO || '/static/avatar/default/go.png'" />
            <div class="color away"></div>
        </div>
        <div class="day">
            <div class="datePickerWrap">
                <Calendar
                    class="datePicker"
                    ref="datePicker"
                    @visible="v => (pickerVisible = v)"
                    @dayNum="v => (dayNum = v)"
                />
            </div>
            <span
                @click="showDatePicker"
                :class="{ active: pickerVisible }"
                class="date-text"
                :data-tips="`总计 ${dayNum} 条`"
                v-if="!miniMode"
            >
                {{ currDay }}
            </span>
            <i class="el-icon-date date-icon" v-else></i>
        </div>
        <i @click="$store.commit('query/search/toggleShowSearchAndFilter', true)" class="material-icons">search</i>
    </header>
</template>
<script>
import { HEAD_INFOS } from '@/config.js';
import Calendar from './components/Calendar/index';

export default {
    name: 'Query-Aside-Header',
    props: {
        miniMode: Boolean,
    },
    data: () => ({
        HEAD_INFOS,
        pickerVisible: false,
        dayNum: '-',
    }),
    computed: {
        currDay() {
            return this.$store.state.currDay;
        },
    },
    methods: {
        showDatePicker() {
            this.$refs.datePicker.$refs.picker.focus();
        },
    },
    components: {
        Calendar,
    },
};
</script>
<style lang="sass" scoped>
@import "../../avatar.sass"

$background-color: rgba(250,250,250,0.8)
$show-tips-transition: all 0.3s

.header
    background-color: #343E48
    padding: 10px
    display: flex
    align-items: center
    justify-content: space-between
    color: #fff
    font-weight: bold
    @include avatar
    .day
        position: relative
        .datePickerWrap
            opacity: 0
            position: absolute
            left: 0
            top: 0
            z-index: 1
            width: 100%
            height: 100%
            overflow: hidden
        .date-text
            position: relative
            transition: $show-tips-transition
            &::before
                content: attr(data-tips)
                position: absolute
                z-index: 12
                top: -30px
                left: 50%
                transform: translateX(-50%)
                width: auto
                padding: 2px 5px
                border-radius: 4px
                background: $background-color
                color: #000
                text-align: center
                font-size: 12px
                opacity: 0
            &::after
                content: ''
                position: absolute
                z-index: 11
                left: 50%
                margin-left: -5px
                top: -5px
                transform: translateY(-50%)
                border-width: 5px
                border-style: solid
                border-color: $background-color transparent transparent transparent
                opacity: 0
            &.active
                filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5))
                &::before,&::after
                    transition: $show-tips-transition
                    opacity: 1
    .material-icons
        cursor: pointer
</style>
