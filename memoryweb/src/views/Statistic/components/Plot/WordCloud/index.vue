<template>
    <CardWrap body-style="height: 100%;box-sizing: border-box; " v-loading="loading">
        <div class="top">
            <div class="title"><b>出现 100 次以上的词</b></div>
        </div>
        <div class="tips">
            <span>次数 / 排名</span>
        </div>
        <div ref="wordCloud"></div>
    </CardWrap>
</template>
<script>
import axiosJson from '@/plugins/axios-json';

import { PlotWordCloud } from './plot.js';
import mixin from '../utils/mixin/mixin-plot.js';

export default {
    name: 'Statistic-Components-Plot-WordCloud',
    mixins: [mixin],
    methods: {
        async updatePlot() {
            await this.toggleLoading(true);

            let db = await axiosJson.get(`/statistic/${this.sourceType}/${this.directionType}/wordCloud.json`);
            db = db.filter(({ n }) => n >= 100);
            if (!this.$plot) {
                this.$plot = new PlotWordCloud(this.$refs.wordCloud, db);
            } else {
                this.$plot.changeData(db);
            }

            await this.toggleLoading(false);
        },
    },
};
</script>
<style lang="sass" scoped>
.top
    display: flex
    align-items: center
    .title
        flex: 1 1 auto
        text-align: right
        font-size: 12px
        color: #99a9bf
    .btns
        .icon-radio
            ::v-deep
                .el-radio-button__inner
                    padding: 5px 15px
            .icon
                width: 15px
                height: 15px
.tips
    text-align: right
    font-size: 12px
    font-weight: bold
    margin: 5px 0 10px 0
</style>
