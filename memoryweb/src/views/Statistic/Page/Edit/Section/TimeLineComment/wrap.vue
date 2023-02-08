<template>
    <CountWrap>
        <template #default="{ countType }">
            <TimeLine
                :sourceType="sourceType"
                :title="data[countType].title"
                :url="makeUrl(countType)"
                :plotOptions="{ extra: { showDirection: false } }"
            />
        </template>
    </CountWrap>
</template>
<script>
import CountWrap from '@/views/Statistic/components/SelectWrap/CountWrap.vue';
import { SOURCE_TYPE_EDIT, COUNT_DB_TYPE_NUM, COUNT_DB_TYPE_WORDS } from '@/views/Statistic/const.js';
import TimeLine from '@/views/Statistic/components/Plot/TimeLine/index.vue';

export default {
    name: 'Statistic-Components-Edit-Section-TimeLineComment-wrap',
    data: () => ({
        sourceType: SOURCE_TYPE_EDIT,
    }),
    computed: {
        data() {
            return {
                [COUNT_DB_TYPE_NUM]: {
                    title: '评论字数',
                },
                [COUNT_DB_TYPE_WORDS]: {
                    title: '评论条数',
                },
            };
        },
    },
    methods: {
        makeUrl(countType) {
            return {
                year: `/statistic/${this.sourceType}/${countType}/timeLine/year.json`,
                month: `/statistic/${this.sourceType}/${countType}/timeLine/month.json`,
                day: `/statistic/${this.sourceType}/${countType}/timeLine/day.json`,
            };
        },
    },
    components: {
        CountWrap,
        TimeLine,
    },
};
</script>
<style lang="sass" scoped></style>
