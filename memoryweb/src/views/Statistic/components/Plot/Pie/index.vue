<template>
    <CardWrap body-style="height: 100%;box-sizing: border-box; padding:10px;" v-loading="loading">
        <div ref="chart"></div>
    </CardWrap>
</template>
<script>
import axiosJson from '@/plugins/axios-json';
import { PlotPie } from './plot.js';

import mixin from '../utils/mixin/mixin-plot.js';

export default {
    name: 'Statistic-Components-Plot-Pie',
    mixins: [mixin],
    methods: {
        async updatePlot() {
            await this.toggleLoading(true);

            const data = await axiosJson.get(
                `/statistic/${this.sourceType}/${this.directionType}/pie-typeAndCount.json`,
            );
            // const { count: total, children: db } = data;

            const db = data.children;

            const options = {
                plot: Object.assign({}, this?.plotOptions?.plot),
                extra: Object.assign({ total: data.count }, this?.plotOptions?.extra),
            };

            if (!this.$plot) {
                this.$plot = new PlotPie(this.$refs.chart, db, options);
            } else {
                this.$plot.changeData(db, options);
            }

            await this.toggleLoading(false);
        },
    },
};
</script>
<style lang="sass" scoped></style>
