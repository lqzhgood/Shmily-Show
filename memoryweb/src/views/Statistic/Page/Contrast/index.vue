<template>
    <div class="contrastPage">
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <SourceCountMsgWords />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <YearCountMsgWords />
            </el-col>
        </el-row>

        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <TimeLineMsgWords />
            </el-col>
        </el-row>

        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <WordCloud :sourceType="sourceType" />
            </el-col>
        </el-row>

        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <SectionHr :icon="'el-icon-lollipop'" title="表情统计" />
            </el-col>
        </el-row>

        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <SourceCountEmotion />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <YearCountEmotion />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <TimeLineEmotionsCount />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <EmotionsShow />
            </el-col>
        </el-row>

        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <SectionHr :icon="'el-icon-mouse'" title="纯表情消息统计" />
            </el-col>
        </el-row>

        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <SourceCountEmotionPure />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <YearCountEmotionPure />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" type="flex">
            <el-col :span="24">
                <TimeLineEmotionsPureCount />
            </el-col>
        </el-row>
    </div>
</template>
<script>
import AsyncComponent from '@/components/AsyncComponent';
import { SOURCE_TYPE_CONTRAST, COUNT_DB_TYPE_NUM, COUNT_DB_TYPE_WORDS } from '../../const.js';

import SectionHr from '@/views/Statistic/components/SectionHr/index.vue';

export default {
    name: 'Statistic-Page-Contrast',
    data: () => ({
        COUNT_DB_TYPE_NUM,
        COUNT_DB_TYPE_WORDS,
        countType: COUNT_DB_TYPE_NUM,
        sourceType: SOURCE_TYPE_CONTRAST,
    }),
    components: {
        SectionHr,
        SourceCountMsgWords: () => AsyncComponent(import('./Section/SourceCountMsgWords/wrap.vue')),
        SourceCountEmotion: () => AsyncComponent(import('./Section/SourceCountEmotion/index.vue')),
        SourceCountEmotionPure: () => AsyncComponent(import('./Section/SourceCountEmotionPure/index.vue')),
        YearCountMsgWords: () => AsyncComponent(import('./Section/YearCountMsgWords/wrap.vue')),
        YearCountEmotion: () => AsyncComponent(import('./Section/YearCountEmotion/wrap.vue')),
        YearCountEmotionPure: () => AsyncComponent(import('./Section/YearCountEmotionPure/wrap.vue')),
        WordCloud: () => AsyncComponent(import('../../components/Plot/WordCloud/wrap.vue')),
        TimeLineMsgWords: () => AsyncComponent(import('./Section/TimeLineMsgWords/wrap.vue')),
        EmotionsShow: () => AsyncComponent(import('./Section/EmotionsShow/index.vue')),
        TimeLineEmotionsCount: () => AsyncComponent(import('./Section/TimeLineEmotionsCount/index.vue')),
        TimeLineEmotionsPureCount: () => AsyncComponent(import('./Section/TimeLineEmotionsPureCount/index.vue')),
    },
};
</script>
<style lang="sass" scoped>
.contrastPage
    .row
        margin-bottom: 10px
        align-items: stretch
</style>
