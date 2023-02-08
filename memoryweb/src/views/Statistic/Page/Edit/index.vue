<template>
    <div class="wrap">
        <el-row :gutter="10" class="row" type="flex" v-if="hasModifyMode">
            <el-col :span="24">
                <SourceCount_Modify_Count />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" type="flex" v-if="hasCommentMode">
            <el-col :span="24">
                <SectionHr :icon="'el-icon-edit'" title="评论统计" />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" type="flex" v-if="hasCommentMode">
            <el-col :span="24">
                <SourceCountComment />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" type="flex" v-if="hasCommentMode">
            <el-col :span="24">
                <YearCountComment />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" type="flex" v-if="hasCommentMode">
            <el-col :span="24">
                <TimeLineComment />
            </el-col>
        </el-row>

        <el-row :gutter="10" class="row" type="flex" v-if="hasCommentMode">
            <el-col :span="24">
                <HeatmapComment />
            </el-col>
        </el-row>
    </div>
</template>
<script>
import AsyncComponent from '@/components/AsyncComponent';
import { SOURCE_TYPE_EDIT } from '../../const.js';

import SectionHr from '@/views/Statistic/components/SectionHr/index.vue';

export default {
    name: 'Page-Statistic-Component-COMMON-Index',
    data: () => ({
        sourceType: SOURCE_TYPE_EDIT,
    }),
    computed: {
        hasCommentMode() {
            return this.$store.getters.hasCommentMode;
        },
        hasModifyMode() {
            return this.$store.getters.hasModifyMode;
        },
        urlWord() {
            return {
                year: `/statistic/${this.sourceType}/timeLine-word/year.json`,
                month: `/statistic/${this.sourceType}/timeLine-word/month.json`,
                day: `/statistic/${this.sourceType}/timeLine-word/day.json`,
            };
        },
    },
    components: {
        SectionHr,
        SourceCountComment: () => AsyncComponent(import('./Section/SourceCountComment/wrap.vue')),
        TimeLineComment: () => AsyncComponent(import('./Section/TimeLineComment/wrap.vue')),
        YearCountComment: () => AsyncComponent(import('./Section/YearCountComment/wrap.vue')),
        HeatmapComment: () => AsyncComponent(import('./Section/HeatmapComment/wrap.vue')),
        SourceCount_Modify_Count: () => AsyncComponent(import('./Section/SourceCount_Modify_Count.vue')),
    },
};
</script>
<style lang="sass" scoped>
.wrap
    .row
        margin-bottom: 10px
        align-items: stretch
</style>
