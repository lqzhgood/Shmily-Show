<template>
    <CardWrap v-loading="loading" class="TimeLineWrap">
        <div class="top">
            <div class="title">
                <slot name="title">{{ title }}</slot>
            </div>
            <div class="selectWrap">
                <el-radio-group @change="updatePlot" class="select" v-model="dateType" data-size="nano">
                    <el-radio-button label="year">年</el-radio-button>
                    <el-radio-button label="month">月</el-radio-button>
                    <el-radio-button label="day">日</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div class="timeLine">
            <div ref="chart" class="chart"></div>
        </div>
    </CardWrap>
</template>
<script>
import axiosJson from '@/plugins/axios-json';

import { PlotLine } from './plot.js';
import mixin from '../utils/mixin/mixin-plot.js';

export default {
    name: 'Statistic-Components-Plot-TimeLine',
    mixins: [mixin],
    data: () => ({
        dateType: 'year',
    }),
    computed: {
        defaultUrl() {
            return {
                year: `/statistic/${this.sourceType}/${this.directionType}/timeLine/year.json`,
                month: `/statistic/${this.sourceType}/${this.directionType}/timeLine/month.json`,
                day: `/statistic/${this.sourceType}/${this.directionType}/timeLine/day.json`,
            };
        },
    },
    methods: {
        async updatePlot(y) {
            await this.toggleLoading(true);

            const url = this.url || this.defaultUrl;
            const dbUrl = url[y || this.dateType];
            const db = await axiosJson(dbUrl);

            const options = {
                plot: Object.assign({}, this?.plotOptions?.plot),
                extra: Object.assign({}, this?.plotOptions?.extra),
            };

            if (!this.$plot) {
                this.$plot = new PlotLine(this.$refs.chart, db, options);
            } else {
                this.$plot.changeData(db, options);
            }

            await this.toggleLoading(false);
        },
        replaceUrl(urlTmpl, k, v) {
            return urlTmpl.replaceAll(k, v);
        },
    },
};
</script>
<style lang="sass" scoped>
@import '../style.sass'


.TimeLineWrap
    .top
        margin-bottom: 10px
        position: relative
        .title
            position: absolute
            left: 0
            top: 0
            right: 0
            bottom: 0
            width: 100%
            text-align: center
            font-size: 12px
            white-space: nowrap
            color: #99a9bf
            display: flex
            justify-content: center
            align-items: center
        .selectWrap
            text-align: right
    .timeLine
        position: relative
        .chart
            @include g2-tooltip
</style>
