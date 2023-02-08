<template>
    <el-date-picker
        :picker-options="pickerOptions"
        @change="changeDay"
        format="yyyy-MM-dd HH:mm:ss"
        popper-class="datePicker"
        type="datetime"
        v-model="localDay"
        ref="picker"
        @blur="$emit('visible', false)"
        @focus="$emit('visible', true)"
    ></el-date-picker>
</template>
<script>
import dayjs from 'dayjs';
import dayNum from '@/assets/data_pre/msg/dayNum.json';

import { FORMAT_TIME } from '@/utils/const';

export default {
    name: 'Query-Aside-Header-Calendar',
    data: () => ({
        localDay: '', // 内部使用，点击日期图标会变， 这个默认值没啥意义 会被覆写
    }),
    computed: {
        msgAll() {
            return this.$store.state.msgAll;
        },
        currDay() {
            return this.$store.state.currDay;
        },
        pickerOptions() {
            const dayNum_step = dayNum.max / 10;
            return {
                disabledDate(date) {
                    const day = dayjs(date).format('YYYY-MM-DD');
                    const todayNum = dayNum.data[day];
                    return !todayNum;
                },
                cellClassName(date) {
                    const day = dayjs(date).format('YYYY-MM-DD');
                    const todayNum = dayNum.data[day];
                    if (!todayNum) return null;
                    const ratio = Math.ceil(todayNum / dayNum_step);
                    return `isDay ratio-${ratio}`;
                },
            };
        },
    },
    watch: {
        localDay(date) {
            const day = dayjs(date).format('YYYY-MM-DD');
            const todayNum = dayNum.data[day] || '-';
            this.$emit('dayNum', todayNum);
        },
        currDay(v) {
            this.localDay = v;
        },
    },
    methods: {
        // 按下确定
        async changeDay(day) {
            await this.$store.dispatch('goToDay', { day: dayjs(day).format(FORMAT_TIME) });
        },
    },
};
</script>
<style lang="sass">
$dark: rgba(0, 0, 0, 0.85)
$light: rgba(255, 255, 255,1)

.datePicker
    .isDay
        @for $i from 1 through 5
            &.ratio-#{$i}
                > div
                    color: $dark
        @for $i from 1 through 5
            &.ratio-#{$i+5}
                > div
                    color: $light
        &.ratio-1
            > div
                background: #fff2e8
        &.ratio-2
            > div
                background: #ffd8bf
        &.ratio-3
            > div
                background: #ffbb96
        &.ratio-4
            > div
                background: #ff9c6e
        &.ratio-5
            > div
                background: #ff7a45
        &.ratio-6
            > div
                background: #fa541c
        &.ratio-7
            > div
                background: #d4380d
        &.ratio-8
            > div
                background: #ad2102
        &.ratio-9
            > div
                background: #871400
        &.ratio-10
            > div
                background: #610b00
</style>
