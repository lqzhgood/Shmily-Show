<template>
    <div :class="{ hideDisable }" class="VerticalDatePicker">
        <div :class="{ current: currYear === year }" :key="year" class="block" v-for="{ year, months } in _range.range">
            <div
                :class="{ disable: months.length == 0 || months.every(m => m.disable) }"
                :key="year"
                @click="clickYear(year)"
                class="year row"
            >
                {{ year }}
            </div>
            <el-collapse-transition>
                <div class="monthWrap" v-show="currYear === year">
                    <div
                        :class="{ current: m.month === currMonth, disable: m.disable }"
                        :key="m.month"
                        @click="clickMonth(year, m.month)"
                        class="row month"
                        v-for="m in months"
                    >
                        <div class="dot">
                            <em class="bor_t"></em>
                            <em class="S_dot"></em>
                            <em class="bor_b"></em>
                        </div>
                        <span class="text">{{ m.month }}月</span>
                    </div>
                </div>
            </el-collapse-transition>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs';

const T_S_Y = 'year'; // type-string-year
const T_A_YM = '[{year:y,disable:false,months:[{month:m,disable:true}]}]'; // 最终内部使用格式

export default {
    name: 'Components-VerticalDatePicker',
    data: () => ({}),
    props: {
        // 当前显示的日期
        day: {
            type: String,
            default: dayjs().format('YYYY-MM-DD'),
            validator: v => dayjs(v).isValid(),
        },
        // 时间范围 默认10年 2010-2020
        range: {
            type: [String, Array],
            default: `${new Date().getFullYear() - 10}-${new Date().getFullYear()}`,
        },
        clickYear: {
            type: Function,
            default(year) {
                this.changeDay(`${year}-${this._range.reverse ? '12-31' : '01-01'}`);
            },
        },
        clickMonth: {
            type: Function,
            default(year, month) {
                this.changeDay(`${year}-${month}-${this._range.reverse ? '31' : '01'}`);
            },
        },
        hideDisable: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        // 排序 整理为  T_A_YM [ {y1:[m1,2],y2:false} ] 的标准格式
        _range() {
            const r = this.range;
            const t = /^\d{4}-\d{4}$/.test(r) ? T_S_Y : T_A_YM;
            switch (t) {
                case T_S_Y: {
                    const s = r.match(/^\d{4}/).toString() * 1;
                    const e = r.match(/\d{4}$/).toString() * 1;
                    const reverse = s > e;
                    return {
                        reverse,
                        range: this.makerOrderArr(s, e).map(y => ({
                            year: y,
                            months: (reverse ? this.makerOrderArr(12, 1) : this.makerOrderArr(1, 12)).map(m => ({
                                month: m,
                            })),
                        })),
                    };
                }
                case T_A_YM: {
                    return {
                        reverse: r[0].year > r.slice(-1)[0].year,
                        range: r,
                    };
                }
                default:
                    throw new Error('unknown type');
            }
        },
        currYear() {
            return dayjs(this.day).year();
        },
        currMonth() {
            return dayjs(this.day).month() + 1;
        },
    },
    methods: {
        changeDay(day) {
            this.$emit('update:day', day);
        },
        makerOrderArr(s, e) {
            if (s > e) {
                // 2020 - 2010
                return Array.from(new Array(s + 1).keys())
                    .slice(e)
                    .reverse();
            } else {
                // 2010 - 2020
                return Array.from(new Array(e + 1).keys()).slice(s);
            }
        },
    },
};
</script>
<style lang="sass" scoped>
@mixin trs
    transition: all 0.3s


$color_bg: #90DBD6
$color_font: rgb(255,255,255)
// $color_bg: #bb99d7



.VerticalDatePicker
    font-size: 12px
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif
    font-weight: 400
    &.hideDisable
        .disable
            display: none
    .block
        margin-top: 3px
        opacity: 0.6
        @include trs
        &:first-child
            margin-top: 0
        &:hover
            opacity: 1
        .row
            height: 26px
            line-height: 26px
            text-decoration: none
            border-left-width: 4px
            border-left-style: solid
            border-left-color: $color_bg
            width: 38px
            text-align: right
            color: $color_font
            position: relative
            cursor: pointer
            @include trs
            &.year
                text-align: right
            &.month
                &:hover
                    font-weight: bold
                &.disable
                    cursor: not-allowed
                     @include trs
                    .text
                        opacity: 0.2
                    &:hover
                        .text
                            opacity: 0.8
                &.current
                    border-left-color: transparent
                    .dot
                        opacity: 1
                    .text
                        opacity: 1
                        color: $color_font
                        font-weight: bold
                .dot
                    position: absolute
                    left: -4px
                    top: 0
                    opacity: 0
                    @include trs
                    em
                        display: inline-block
                        width: 4px
                        height: 7px
                        position: absolute
                        top: 0
                        left: 0
                        overflow: hidden
                        padding: 0
                        margin: 0
                        border-radius: 0
                        background-color: $color_bg
                        &.S_dot
                            width: 6px
                            height: 6px
                            border-radius: 50%
                            left: -1px
                            top: 9px
                        &.bor_t
                            top: 0
                        &.bor_b
                            top: 17px
                            height: 9px
                .text
                    padding-right: 3px
                    opacity: 0.9
        &.current
            opacity: 1
            .row
                &.year
                    text-align: center
                    color: $color_font
                    background-color: $color_bg
                    opacity: 1
                    border-radius: 0 3px 3px 0
</style>
