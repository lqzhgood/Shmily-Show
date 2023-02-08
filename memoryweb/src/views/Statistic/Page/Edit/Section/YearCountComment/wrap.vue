<template>
    <CountWrap>
        <template #default="{ countType }">
            <YearCount
                :sourceType="sourceType"
                :url="makeUrl(countType)"
                :unit="data[countType].unit"
                :title="data[countType].title"
            />
        </template>
    </CountWrap>
</template>
<script>
import CountWrap from '@/views/Statistic/components/SelectWrap/CountWrap.vue';
import { SOURCE_TYPE_EDIT, COUNT_DB_TYPE_NUM, COUNT_DB_TYPE_WORDS } from '@/views/Statistic/const.js';
import YearCount from '@/views/Statistic/components/Plot/YearCount/index.vue';

export default {
    name: 'Statistic-Components-Edit-Section-YearCountComment-wrap',
    data: () => ({
        sourceType: SOURCE_TYPE_EDIT,
    }),
    computed: {
        data() {
            return {
                [COUNT_DB_TYPE_NUM]: {
                    title: '评论条数',
                },
                [COUNT_DB_TYPE_WORDS]: {
                    title: '评论字数',
                    unit: '字',
                },
            };
        },
    },
    methods: {
        makeUrl(countType) {
            return `/statistic/${this.sourceType}/${countType}/comment-year-count.json`;
        },
    },
    components: {
        CountWrap,
        YearCount,
    },
};
</script>
<style lang="sass" scoped></style>
