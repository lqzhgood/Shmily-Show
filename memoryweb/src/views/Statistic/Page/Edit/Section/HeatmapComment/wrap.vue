<template>
    <CountWrap center>
        <template #default="{ countType }">
            <Heatmap
                :sourceType="sourceType"
                :directionType="null"
                :url="data[countType].url"
                :plotOptions="{ extra: { showDirection: false } }"
                :yearRange="CommentYearRange"
            />
        </template>
    </CountWrap>
</template>
<script>
import CountWrap from '@/views/Statistic/components/SelectWrap/CountWrap.vue';
import { SOURCE_TYPE_EDIT, COUNT_DB_TYPE_NUM, COUNT_DB_TYPE_WORDS } from '@/views/Statistic/const.js';
import Heatmap from '@/views/Statistic/components/Plot/Heatmap/index.vue';
import CommentYearRange from '@/assets/data_pre/statistic/Edit/ALL_YEAR.json';

export default {
    name: 'Statistic-Components-Edit-Section-HeatmapComment-wrap',
    data: () => ({
        CommentYearRange,
        sourceType: SOURCE_TYPE_EDIT,
    }),
    computed: {
        data() {
            return {
                [COUNT_DB_TYPE_NUM]: {
                    url: `/statistic/${SOURCE_TYPE_EDIT}/heatmap-${COUNT_DB_TYPE_NUM}`,
                },
                [COUNT_DB_TYPE_WORDS]: {
                    url: `/statistic/${SOURCE_TYPE_EDIT}/heatmap-${COUNT_DB_TYPE_WORDS}`,
                },
            };
        },
    },
    components: {
        CountWrap,
        Heatmap,
    },
};
</script>
<style lang="sass" scoped></style>
