<template>
    <CardWrap v-loading="loading">
        <div class="wrap">
            <div class="total">
                <div class="title">
                    <slot name="title">
                        <b>{{ title || sourceType }}</b>
                    </slot>
                </div>
                <div class="content" v-if="sourceData">
                    <DirectionTip :unit="unit" :direction="sourceData.direction" placement="right">
                        <span>
                            {{ sourceData.count }}
                            <span class="unit">{{ unit }}</span>
                        </span>
                    </DirectionTip>
                </div>
                <div class="specialDay" v-if="activityDayData">
                    <span class="label">活跃时间</span>
                    <DirectionTip :unit="unit" :direction="activityDayData.activityDayDirection" placement="right">
                        <span class="value">{{ activityDayData.activityDay }}</span>
                    </DirectionTip>
                    <span class="unit">天</span>
                    <el-divider direction="vertical" class="hr" />
                    <DirectionTip :direction="null" placement="right">
                        <template #title>
                            总计 {{ activityDayData.allDay }} 天 | 占比 {{ activityDayData.activityDayP }}%
                        </template>
                        <span>{{ activityDayData.activityDayP }}%</span>
                    </DirectionTip>
                </div>
                <div class="specialDay" v-if="avgData">
                    <span class="label">平均每天</span>
                    <DirectionTip :unit="unit" :direction="avgData.avgDirection" placement="right">
                        <span class="value">{{ avgData.avg }}</span>
                    </DirectionTip>
                    <span class="unit">{{ unit }}</span>
                </div>
                <div class="specialDay" v-if="maxData">
                    <span class="label">最多当天</span>
                    <span class="value">{{ maxData.max }}</span>
                    <span class="unit">{{ unit }}</span>
                    <el-divider direction="vertical" class="hr" />
                    <span :key="d.date" class="maxDay" v-for="d in maxData.maxDay">
                        <DirectionTip :unit="unit" :direction="d.direction" placement="right">
                            <span>{{ d.date }}</span>
                        </DirectionTip>
                    </span>
                </div>
            </div>
            <div class="types" v-if="sourceData">
                <div :key="v.label" class="type" v-for="v in sourceData.children">
                    <img :src="v.icon" class="icon" v-if="v.icon" />
                    <span class="label">{{ v.label }}</span>

                    <DirectionTip :unit="unit" :direction="v.direction" class="count">
                        <span>{{ v.count }}</span>
                    </DirectionTip>
                </div>
            </div>
        </div>
    </CardWrap>
</template>
<script>
import DirectionTip from '../../Tips/DirectionTip.vue';
import mixin from '../utils/mixin/mixin-plot.js';

import { deepFreeze } from '@/utils/index';
import axiosJson from '@/plugins/axios-json';

export default {
    name: 'Statistic-Components-Plot-SourceCount',
    mixins: [mixin],
    data: () => ({
        maxData: null,
        sourceData: null,
        avgData: null,
        activityDayData: null,
    }),
    computed: {
        defaultUrl() {
            return `/statistic/${this.sourceType}/${this.directionType}/sourceCount.json`;
        },
    },
    methods: {
        async updatePlot() {
            await this.toggleLoading(true);

            const url = this.url || this.defaultUrl;
            const db = await axiosJson.get(url);
            const { sourceData, maxData, avgData, activityDayData } = deepFreeze(db);
            this.sourceData = sourceData;
            this.maxData = maxData;
            this.avgData = avgData;
            this.activityDayData = activityDayData;

            await this.toggleLoading(false);
        },
    },
    components: {
        DirectionTip,
    },
};
</script>
<style lang="sass" scoped>
.wrap
    display: flex
    font-size: 12px
    .total
        display: flex
        flex: 1 0 180px
        flex-direction: column
        justify-content: space-between
        margin-right: 20px
        .title
            color: rgba(0,0,0,.45)
            font-size: 14px
            margin-bottom: 5px
            white-space: nowrap
        .content
            color: rgba(0,0,0,.85)
            font-size: 20px
            .unit
                font-size: 12px
        .specialDay
            white-space: nowrap
            align-items: baseline
            display: flex
            .label
                color: #99a9bf
                min-width: 60px
                margin-right: 5px
                display: inline-block
                text-align: justify
                text-align-last: justify
                white-space: normal
            .value
                font-style: italic
            .unit
                margin-left: 3px
            .hr
                margin-top: 2px
                position: relative
                top: 4px
    .types
        text-align: right
        flex: 1 1 auto
        display: flex
        flex-wrap: wrap-reverse
        flex-direction: row-reverse
        align-content: baseline
        .type
            display: flex
            align-items: flex-end
            margin-left: 10px
            margin-top: 5px
            width: 150px
            padding-right: 10px
            box-sizing: border-box
            border-right: 1px solid #dcdfe6
            font-size: 12px
            .icon
                width: 15px
                vertical-align: middle
                object-fit: contain
            .label
                margin: 0 5px
                display: inline-block
                flex: 1 1 auto
                text-align: left
                white-space: nowrap
            .count
                display: inline-block
                flex: 1 1 auto
                white-space: nowrap
</style>
