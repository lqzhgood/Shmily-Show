<template>
    <CardWrap body-style="padding: 5px 10px;min-height: 200px">
        <div class="timeHotWrap">
            <div class="tips" v-show="timeHotActive != HEATMAP_DB_TYPE_YEAR">
                <el-tag class="text">图例颜色比例</el-tag>
                <el-switch active-text="按全部" inactive-text="按当年" v-model="maxTypeIsAll"></el-switch>
            </div>

            <div class="btns">
                <el-radio-group v-model="timeHotActive" data-size="nano">
                    <el-radio-button :label="HEATMAP_DB_TYPE_YEAR">年</el-radio-button>
                    <el-radio-button :label="HEATMAP_DB_TYPE_WEEK">周</el-radio-button>
                    <el-radio-button :label="HEATMAP_DB_TYPE_DAY">日</el-radio-button>
                </el-radio-group>
            </div>
            <div class="yearSelect" v-if="timeHotActive != HEATMAP_DB_TYPE_YEAR">
                <el-checkbox-group v-model="YEAR_SELECT">
                    <el-checkbox :key="v" :label="v" v-for="v in yearRange"></el-checkbox>
                </el-checkbox-group>
                <hr />
            </div>
            <HeatMapTimeYear
                :sourceType="sourceType"
                :directionType="directionType"
                v-if="timeHotActive == HEATMAP_DB_TYPE_YEAR"
                v-bind="$attrs"
            />

            <HeatMapTimeWeekAndDay
                :heatmapType="HEATMAP_DB_TYPE_WEEK"
                :key="HEATMAP_DB_TYPE_WEEK + y"
                :maxTypeIsAll="maxTypeIsAll"
                :sourceType="sourceType"
                :directionType="directionType"
                :year="y"
                v-else-if="timeHotActive == HEATMAP_DB_TYPE_WEEK"
                v-for="y in YEAR_SELECT_SORT"
                v-bind="$attrs"
            />
            <HeatMapTimeWeekAndDay
                :heatmapType="HEATMAP_DB_TYPE_DAY"
                :key="HEATMAP_DB_TYPE_DAY + y"
                :maxTypeIsAll="maxTypeIsAll"
                :sourceType="sourceType"
                :directionType="directionType"
                :year="y"
                v-for="y in YEAR_SELECT_SORT"
                v-else-if="timeHotActive == HEATMAP_DB_TYPE_DAY"
                v-bind="$attrs"
            />
        </div>
    </CardWrap>
</template>
<script>
import _ from 'lodash';
import AsyncComponent from '@/components/AsyncComponent';

import MSG_ALL_YEAR from '@/assets/data_pre/statistic/Msg/ALL_YEAR.json';
import { HEATMAP_DB_TYPE_YEAR, HEATMAP_DB_TYPE_WEEK, HEATMAP_DB_TYPE_DAY } from '@/views/Statistic/const.js';

export default {
    name: 'Statistic-Components-Plot-Heatmap',
    mounted() {
        this.maxTypeIsAll = JSON.parse(localStorage.maxTypeIsAll || false);
        // 默认前三年
        const DEFAULT_SHOW_YEARS = [2017, 2018, 2019];
        this.YEAR_SELECT = DEFAULT_SHOW_YEARS.every(v => this.yearRange.includes(v))
            ? DEFAULT_SHOW_YEARS
            : this.yearRange.slice(-3);
    },
    props: {
        yearRange: { type: Array, default: () => [...MSG_ALL_YEAR] },
        sourceType: { type: String, required: true },
        directionType: { type: String },
    },
    data: () => ({
        HEATMAP_DB_TYPE_YEAR,
        HEATMAP_DB_TYPE_WEEK,
        HEATMAP_DB_TYPE_DAY,
        YEAR_SELECT: [],
        timeHotActive: 'year',
        maxTypeIsAll: false,
    }),
    computed: {
        YEAR_SELECT_SORT() {
            return _.sortBy(this.YEAR_SELECT);
        },
    },
    watch: {
        maxTypeIsAll(v) {
            localStorage.maxTypeIsAll = v;
        },
    },
    components: {
        HeatMapTimeYear: () => AsyncComponent(import('./components/year.vue')),
        HeatMapTimeWeekAndDay: () => AsyncComponent(import('./components/weekAndDay.vue')),
    },
};
</script>
<style lang="sass" scoped>
.timeHotWrap
    position: relative
    padding-top: 40px
    padding-bottom: 100px
    .tips
        position: absolute
        top: 0
        left: 5px
        .text
            margin-right: 10px
            font-size: 14px
    .btns
        position: absolute
        top: 0
        right: 5px
    .yearSelect
        text-align: center
        margin: 5px 0
        ::v-deep
            .el-checkbox
                margin-right: 10px
</style>
