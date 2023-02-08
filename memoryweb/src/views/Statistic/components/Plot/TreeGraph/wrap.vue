<template>
    <DirectionWrap>
        <template #default="{ directionType }">
            <Plot :directionType="directionType" v-bind="$attrs" style="padding-top: 25px" />
        </template>
    </DirectionWrap>
</template>
<script>
import mixin from '../utils/mixin/mixin-direction-wrap.js';
import Plot from './index.vue';

export default {
    name: 'Statistic-Components-Plot-TreeGraph-Wrap',
    mixins: [mixin],
    components: {
        Plot,
    },
};
</script>
<style lang="sass" scoped></style>
