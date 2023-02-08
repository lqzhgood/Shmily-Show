<template>
    <DirectionWrap :btnsStyle="btnsStyle">
        <template #default="{ directionType }">
            <Plot :directionType="directionType" v-bind="$attrs" style="padding-top: 20px" />
        </template>
    </DirectionWrap>
</template>
<script>
import mixin from '@/views/Statistic/components/Plot/utils/mixin/mixin-direction-wrap.js';
import Plot from './index.vue';

export default {
    name: 'Statistic-Page-COMMON-Components-SourceCount-Wrap',
    mixins: [mixin],
    data: () => ({
        btnsStyle: {
            // right: '50px',
        },
    }),
    components: {
        Plot,
    },
};
</script>
<style lang="sass" scoped></style>
