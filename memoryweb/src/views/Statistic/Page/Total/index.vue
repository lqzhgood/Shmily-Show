<template>
    <div class="sHome">
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="8">
                <TotalPie :sourceType="sourceType" :plotOptions="{ plot: { color: CONST_USE_COLOR_MAP } }" />
            </el-col>
            <el-col :span="16">
                <TotalTreeGraph :sourceType="sourceType" />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <TotalYearCount :sourceType="sourceType" />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <TotalLineTime
                    :sourceType="sourceType"
                    :plotOptions="{ plot: { height: 560, color: CONST_USE_COLOR_MAP } }"
                />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <TotalHeatmap :sourceType="sourceType" />
            </el-col>
        </el-row>
    </div>
</template>
<script>
import AsyncComponent from '@/components/AsyncComponent';

import { SOURCE_TYPE_TOTAL } from '../../const.js';
import { CONST_USE_COLOR_MAP } from '@/views/Statistic/components/Plot/utils/index.js';

export default {
    name: 'Page-Statistic-All',
    data: () => ({
        CONST_USE_COLOR_MAP,
        sourceType: SOURCE_TYPE_TOTAL,
    }),
    methods: {},
    components: {
        TotalPie: () => AsyncComponent(import('../../components/Plot/Pie/wrap.vue')),
        TotalTreeGraph: () => AsyncComponent(import('../../components/Plot/TreeGraph/wrap.vue')),
        TotalLineTime: () => AsyncComponent(import('../../components/Plot/TimeLine/wrap.vue')),
        TotalHeatmap: () => AsyncComponent(import('../../components/Plot/Heatmap/wrap.vue')),
        TotalYearCount: () => AsyncComponent(import('../../components/Plot/YearCount/wrap.vue')),
    },
};
</script>
<style lang="sass" scoped>
.sHome
    .row
        margin-bottom: 10px
        align-items: stretch
</style>
