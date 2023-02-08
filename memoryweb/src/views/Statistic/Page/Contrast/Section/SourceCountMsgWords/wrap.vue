<template>
    <SourceCount :sourceType="sourceType" :unit="'字'" :title="'消息字数'" :url="url" />
</template>
<script>
import { SOURCE_TYPE_CONTRAST, COUNT_DB_TYPE_WORDS, DIRECTION_TYPE_ALL } from '../../../../const.js';

import SourceCount from '../../../../components/Plot/SourceCount/index.vue';

export default {
    name: 'Statistic-Contrast-Section-MsgWordCOunt-Wrap',

    data: () => ({
        sourceType: SOURCE_TYPE_CONTRAST,
    }),
    computed: {
        url() {
            return `/statistic/${this.sourceType}/${DIRECTION_TYPE_ALL}/${COUNT_DB_TYPE_WORDS}/sourceCount.json`;
        },
    },
    components: {
        SourceCount,
    },
};
</script>
<style lang="sass" scoped></style>
