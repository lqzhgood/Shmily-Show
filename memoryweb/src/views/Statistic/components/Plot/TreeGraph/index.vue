<template>
    <CardWrap
        body-style="height: 100%;box-sizing: border-box; padding:10px"
        style="height: 100%; box-sizing: border-box"
        v-loading="loading"
    >
        <div :class="{ full: full }" class="wrap">
            <div class="chart" ref="chart"></div>
            <div class="btns">
                <i @click="collapsedFn(false)" class="btn el-icon-plus" title="展开-所有子节点" v-if="collapsed"></i>
                <i @click="collapsedFn(true)" class="btn el-icon-minus" title="缩小-所有子节点" v-else></i>
                <i :title="full ? '取消全屏' : '全屏'" @click="fullFn" class="btn el-icon-full-screen"></i>
            </div>
        </div>
    </CardWrap>
</template>
<script>
import axiosJson from '@/plugins/axios-json';
import mixin from '../utils/mixin/mixin-plot.js';

import { PlotTreeGraph } from './plot.js';

// !!! SOURCE_TYPE_TOTAL 独有 不可作为 [公共组件] 使用

export default {
    name: 'Statistic-Components-Plot-TreeGraph',
    mixins: [mixin],
    data: () => ({
        full: false,
        collapsed: true,
    }),
    methods: {
        async updatePlot() {
            await this.toggleLoading(true);

            const db = await axiosJson.get(
                `/statistic/${this.sourceType}/${this.directionType}/mind-typeAndCount.json`,
            );
            // 默认第一级节点收缩
            db.children.forEach(v => {
                v.collapsed = true;
            });
            this.collapsed = true;

            if (!this.$plot) {
                this.$plot = new PlotTreeGraph(this.$refs.chart, db);
            } else {
                this.$plot.changeData(db);
            }

            await this.toggleLoading(false);
        },
        async fullFn() {
            const { plot: graph } = this.$plot;

            this.full = !this.full;
            graph.changeSize(0, 0); // 这里为了避免图片撑大容器,先去让图片变最小. 这样获取 width/height 时就能获得容器的体积.
            await this.$nextTick();
            const container = this.$refs.chart;
            const width = container.scrollWidth;
            const height = container.scrollHeight || 400;
            graph.changeSize(width, height);
            graph.moveTo(0, 0);
        },
        collapsedFn(on_off) {
            const { plot: graph, db } = this.$plot;
            this.collapsed = on_off;
            db.children.forEach(v => {
                v.collapsed = on_off;
            });
            graph.render();
            graph.moveTo(0, 0);
        },
    },
};
</script>
<style lang="sass" scoped>
.wrap
    position: relative
    height: 100%
    &.full
        position: fixed
        left: 0
        right: 0
        background: #fff
        z-index: 1
        bottom: 0
        top: 0
    .chart
        height: 100%
        box-sizing: border-box
        font-size: 0
    .btns
        position: absolute
        right: 10px
        top: 10px
        z-index: 1
        .btn
            margin-left: 10px
            cursor: pointer
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
</style>
