<template>
    <CardWrap v-loading="loading">
        <div class="YearCountWrap">
            <el-scrollbar class="scrollbar">
                <div class="year-count">
                    <div :key="v.year" class="box" v-for="v in list">
                        <div class="title">{{ v.year }}</div>
                        <div class="content">
                            <div class="max">
                                <MaxTip :yearData="v" :unit="unit" placement="top">
                                    <template #title>
                                        <span>{{ v.year }} 年当日最多 {{ v.max }} {{ unit }}</span>
                                    </template>
                                    <span class="count">
                                        <span :class="v.maxDirection">{{ v.max }}</span>
                                    </span>
                                </MaxTip>

                                <span class="divider">/</span>

                                <DirectionTip :direction="v.direction" placement="top" :unit="'条'">
                                    <template #title>
                                        <span>{{ v.year }} 年总计 {{ v.total }} {{ unit }}</span>
                                    </template>
                                    <span>{{ v.total }} {{ unit }}</span>
                                </DirectionTip>
                            </div>
                            <div class="active">
                                <DirectionTip :direction="v.avgDirection" placement="bottom" :unit="'条'">
                                    <template #title>
                                        <span>{{ v.year }} 年平均 {{ v.avg }} {{ unit }}</span>
                                    </template>
                                    <span>{{ v.avg }} {{ unit }}</span>
                                </DirectionTip>

                                <span class="divider">/</span>

                                <DirectionTip :direction="v.activityDayDirection" placement="bottom" :unit="'天'">
                                    <template #title>
                                        <div class="row">
                                            <div class="label">总计</div>
                                            <div class="value">{{ v.allDay }} 天</div>
                                        </div>
                                        <div class="row">
                                            <div class="label">活跃</div>
                                            <div class="value">{{ v.activityDay }} 天</div>
                                        </div>
                                        <div class="row">
                                            <div class="label">占比</div>
                                            <div class="value">{{ v.activityDayP }}%</div>
                                        </div>
                                    </template>
                                    <span>{{ v.activityDay }} 天</span>
                                </DirectionTip>
                            </div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </CardWrap>
</template>
<script>
import { deepFreeze } from '@/utils/index';
import axiosJson from '@/plugins/axios-json';
import mixin from '../utils/mixin/mixin-plot.js';

export default {
    name: 'Statistic-Components-Plot-YearCount',
    mixins: [mixin],
    data: () => ({
        list: [],
    }),
    computed: {
        defaultUrl() {
            return `/statistic/${this.sourceType}/${this.directionType}/year-count.json`;
        },
    },
    methods: {
        async updatePlot() {
            await this.toggleLoading(true);

            const db = await axiosJson.get(this.url || this.defaultUrl);
            this.list = deepFreeze(db);

            await this.toggleLoading(false);
        },
    },
    components: {
        DirectionTip: () => import('../../Tips/DirectionTip.vue'),
        MaxTip: () => import('./components/MaxTip.vue'),
    },
};
</script>
<style lang="sass" scoped>
@import '~@/styles/vars.module.sass'
.YearCountWrap
    display: flex
    .scrollbar
        width: 100%
        height: 100%
        ::v-deep .el-scrollbar__wrap
            width: 100%
            height: 100%
            overflow-y: hidden
            overflow-x: scroll
        .year-count
            display: flex
            small
                font-size: 50%
            .box
                margin: 0 5px
                flex: 1 0 auto
                text-align: right
                .title
                    font-weight: bold
                    margin-bottom: 5px
                .content
                    font-size: 12px
                    .divider
                        padding: 0 2px
                    .max
                        .count
                            white-space: nowrap
                            .go
                                color: $color_direction_go
                            .come
                                color: $color_direction_come
</style>
