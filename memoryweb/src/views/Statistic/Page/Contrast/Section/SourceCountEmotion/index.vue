<template>
    <SourceCount :sourceType="sourceType" :title="'发送表情个数'" :url="url" :unit="'个'" />
</template>
<script>
import SourceCount from '../../../../components/Plot/SourceCount/index.vue';
import { SOURCE_TYPE_CONTRAST, DIRECTION_TYPE_ALL } from '../../../../const.js';

export default {
    name: 'Statistic-Contrast-Section-SourceCount-Emotion',
    data: () => ({
        sourceType: SOURCE_TYPE_CONTRAST,
    }),
    computed: {
        url() {
            return `/statistic/${this.sourceType}/${DIRECTION_TYPE_ALL}/emotion/sourceCount.json`;
        },
    },
    components: {
        SourceCount,
    },
};
</script>
<style lang="sass" scoped></style>
