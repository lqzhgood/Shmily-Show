<template>
    <div class="wrap">
        <slot name="top"></slot>
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <SourceCount :sourceType="sourceType" />
            </el-col>
        </el-row>
        <slot name="row1"></slot>
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <c_YearCount :sourceType="sourceType" />
            </el-col>
        </el-row>
        <slot name="row2"></slot>
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <c_LineTime :sourceType="sourceType" :plotOptions="{ extra: { columns: 'one-columns' } }" />
            </el-col>
        </el-row>
        <slot name="row3"></slot>
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <c_Heatmap :sourceType="sourceType" :plotOptions="{ extra: { columns: 'one-columns' } }" />
            </el-col>
        </el-row>
        <slot name="bottom"></slot>
    </div>
</template>
<script>
import ALL_SOURCE from '@/assets/data_pre/statistic/Msg/ALL_SOURCE.json';
import AsyncComponent from '@/components/AsyncComponent';

function routerSourceType(to, from, next) {
    const { sourceType } = to.params;
    if (!ALL_SOURCE.includes(sourceType)) {
        next({ path: `./${ALL_SOURCE[0]}` });
    } else {
        next();
    }
}
export default {
    name: 'Page-Statistic-Component-COMMON-Index',
    props: {
        sourceTypeByComponent: { type: String },
    },
    computed: {
        sourceType() {
            return this.sourceTypeByComponent || this.$route.params.sourceType;
        },
    },
    beforeRouteEnter: routerSourceType,
    beforeRouteUpdate: routerSourceType,
    components: {
        SourceCount: () => AsyncComponent(import('../../../components/Plot/SourceCount/wrap.vue')),
        c_YearCount: () => AsyncComponent(import('../../../components/Plot/YearCount/wrap.vue')),
        c_LineTime: () => AsyncComponent(import('../../../components/Plot/TimeLine/wrap.vue')),
        c_Heatmap: () => AsyncComponent(import('../../../components/Plot/Heatmap/wrap.vue')),
    },
};
</script>
<style lang="sass" scoped>
.wrap
    .row
        margin-bottom: 10px
        align-items: stretch
</style>
