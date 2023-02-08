<template>
    <LoadingDiv :loading="loading" class="wrap">
        <div class="currYear">
            <el-tooltip placement="right" popper-class="heatmap-weekAndDay-currYearInfo-tips">
                <div slot="content">
                    <div class="o">
                        <span class="key">总计:</span>
                        <span class="value">{{ currYearInfo.total }} 条</span>
                    </div>
                    <div class="o">
                        <span class="key">最高:</span>
                        <span class="value">{{ currYearInfo.max }} 条</span>
                    </div>
                    <template v-if="currYearInfo.maxDays.length > 0">
                        <div class="o"><span class="key">时间:</span></div>
                        <div class="list">
                            <div v-for="d in currYearInfo.maxDays" :key="d">{{ d }}</div>
                        </div>
                    </template>
                </div>
                <span class="text">{{ this.year }}</span>
            </el-tooltip>
        </div>
        <div class="chart" ref="chart"></div>
    </LoadingDiv>
</template>
<script>
import _ from 'lodash';
import axiosJson from '@/plugins/axios-json';
import mixin from '../../utils/mixin/mixin-plot.js';
import { PlotHeatmap } from './plot.js';
import { HEATMAP_DB_TYPE_YEAR, HEATMAP_DB_TYPE_WEEK, HEATMAP_DB_TYPE_DAY } from '@/views/Statistic/const.js';

export default {
    name: 'Statistic-Components-Plot-Heatmap-Components-WeekAndDay',
    mixins: [mixin],
    data: () => ({
        currYearInfo: {
            maxDays: [],
        },
    }),
    props: {
        heatmapType: {
            type: String,
            require: true,
            validator(t) {
                // 这个值必须匹配下列字符串中的一个
                return [HEATMAP_DB_TYPE_YEAR, HEATMAP_DB_TYPE_WEEK, HEATMAP_DB_TYPE_DAY].includes(t);
            },
        },
        year: {
            type: Number,
            require: true,
        },
        maxTypeIsAll: {
            type: Boolean,
            require: true,
        },
    },
    computed: {
        defaultUrl() {
            return `/statistic/${this.sourceType}/${this.directionType}/heatmap/${this.heatmapType}/${this.year}.json`;
        },
    },
    watch: {
        maxTypeIsAll() {
            this.$plot.changeMaxTypeIsAll(this.maxTypeIsAll);
        },
    },
    methods: {
        async updatePlot() {
            await this.toggleLoading(true);

            const url = this.url ? `${this.url}/${this.heatmapType}/${this.year}.json` : this.defaultUrl;
            const db = await axiosJson.get(url);
            this.currYearInfo = _.omit(db.data, 'data');

            const options = {
                plot: Object.assign({}, this?.plotOptions?.plot),
                extra: Object.assign(
                    {
                        type: this.heatmapType,
                        sourceType: this.sourceType,
                        maxTypeIsAll: this.maxTypeIsAll,
                    },
                    this?.plotOptions?.extra,
                ),
            };

            if (!this.$plot) {
                this.$plot = new PlotHeatmap(this.$refs.chart, db, options);
            } else {
                this.$plot.changeData(db, options);
            }

            await this.toggleLoading(false);
        },
    },
};
</script>
<style lang="sass">
.heatmap-weekAndDay-currYearInfo-tips
    .o
        display: flex
        .key
            margin-right: 10px
        .value
            flex: 1 1 auto
            text-align: right
    .list
        padding: 0 5px
        max-height: 100px
        text-align: right
        overflow: auto
</style>

<style lang="sass" scoped>
@import '../../style.sass'
.wrap
    display: flex
    .currYear
        flex: 0 0 14px
        text-align: center
        vertical-align: middle
        display: flex
        align-items: center
        justify-content: center
        background-color: #fafcfb
        transform: rotate(180deg)
        .text
            writing-mode: vertical-lr
            color: #333
            font-size: 16px
    .chart
        flex: 1 1 auto
        padding-left: 10px
        box-sizing: border-box
        @include g2-tooltip
</style>
