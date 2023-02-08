<template>
    <DirectionWrap inner>
        <template #default="{ directionType }">
            <YearCount :sourceType="sourceType" :unit="'个'" :url="makeUrl(directionType)" style="padding-top: 20px" />
        </template>
    </DirectionWrap>
</template>
<script>
import DirectionWrap from '@/views/Statistic/components/SelectWrap/DirectionWrap.vue';
import { SOURCE_TYPE_CONTRAST } from '../../../../const.js';

import YearCount from '../../../../components/Plot/YearCount/index.vue';

export default {
    name: 'Statistic-Contrast-Section-Emotion-Wrap',

    data: () => ({
        sourceType: SOURCE_TYPE_CONTRAST,
    }),
    methods: {
        makeUrl(directionType) {
            return `/statistic/${this.sourceType}/${directionType}/emotion/year-count.json`;
        },
    },
    components: {
        DirectionWrap,
        YearCount,
    },
};
</script>
<style lang="sass" scoped></style>
