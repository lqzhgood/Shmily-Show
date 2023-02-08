<template>
    <CountWrap :defaultSelect="COUNT_DB_TYPE_WORDS">
        <template #default="{ countType }">
            <TimeLine
                :sourceType="sourceType"
                :url="makeUrl(countType)"
                :plotOptions="{ plot: { color: CONST_USE_COLOR_MAP }, extra: { columns: 'one-columns' } }"
            >
                <template #title>
                    <AvatarTip :title="data[countType].title" />
                </template>
            </TimeLine>
        </template>
    </CountWrap>
</template>
<script>
import CountWrap from '@/views/Statistic/components/SelectWrap/CountWrap.vue';
import TimeLine from '../../../../components/Plot/TimeLine/index.vue';
import { SOURCE_TYPE_CONTRAST, DIRECTION_TYPE_ALL, COUNT_DB_TYPE_NUM, COUNT_DB_TYPE_WORDS } from '../../../../const.js';
import { CONST_USE_COLOR_MAP } from '@/views/Statistic/components/Plot/utils/index.js';

import AvatarTip from '../../components/AvatarTip.vue';

export default {
    name: 'Statistic-Contrast-Section-MsgWordCOunt-Wrap',

    data: () => ({
        CONST_USE_COLOR_MAP,
        COUNT_DB_TYPE_WORDS,
        sourceType: SOURCE_TYPE_CONTRAST,
    }),
    computed: {
        data() {
            return {
                [COUNT_DB_TYPE_NUM]: {
                    title: '消息次数',
                },
                [COUNT_DB_TYPE_WORDS]: {
                    title: '消息字数',
                },
            };
        },
    },
    methods: {
        makeUrl(countType) {
            return {
                year: `/statistic/${this.sourceType}/${DIRECTION_TYPE_ALL}/${countType}/timeLine-words/year.json`,
                month: `/statistic/${this.sourceType}/${DIRECTION_TYPE_ALL}/${countType}/timeLine-words/month.json`,
                day: `/statistic/${this.sourceType}/${DIRECTION_TYPE_ALL}/${countType}/timeLine-words/day.json`,
            };
        },
    },
    components: {
        CountWrap,
        TimeLine,
        AvatarTip,
    },
};
</script>
<style lang="sass" scoped></style>
