<template>
    <LoadingDiv :loading="loading">
        <div class="chart" ref="chart"></div>
    </LoadingDiv>
</template>
<script>
import axiosJson from '@/plugins/axios-json';
import mixin from '../../utils/mixin/mixin-plot.js';
import { PlotHeatmap } from './plot.js';
import { HEATMAP_DB_TYPE_YEAR } from '@/views/Statistic/const.js';

export default {
    name: 'Statistic-Components-Plot-Heatmap-Components-Year',
    mixins: [mixin],
    computed: {
        defaultUrl() {
            return `/statistic/${this.sourceType}/${this.directionType}/heatmap/year.json`;
        },
    },
    methods: {
        async updatePlot() {
            await this.toggleLoading(true);

            const url = this.url ? `${this.url}/year.json` : this.defaultUrl;
            const db = await axiosJson.get(url);

            const options = {
                plot: Object.assign({}, this?.plotOptions?.plot),
                extra: Object.assign(
                    {
                        type: HEATMAP_DB_TYPE_YEAR,
                        sourceType: this.sourceType,
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
<style lang="sass" scoped>
@import '../../style.sass'

.chart
    @include g2-tooltip
</style>
