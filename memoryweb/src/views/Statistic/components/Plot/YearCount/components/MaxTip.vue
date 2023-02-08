<template>
    <el-tooltip placement="top" :effect="effect" v-bind="$attrs">
        <div slot="content">
            <div class="title" v-if="$slots.title">
                <slot name="title"></slot>
            </div>
            <hr class="hr" />
            <div class="content" v-if="v.maxDay.length !== 0">
                <div :key="d.date" v-for="(d, i) in v.maxDay">
                    <div class="row">
                        <div class="day">{{ d.date }}</div>
                        <div class="count">{{ d.count }}{{ unit }}</div>
                    </div>
                    <div class="row" v-if="d.direction">
                        <div class="direction come">
                            <img class="img" :src="DEFAULT_AVATAR_COME" />
                            <span>{{ d.direction.come }}</span>
                            <span class="divider">/</span>
                            <span>{{ d.direction.comeP }}%</span>
                        </div>
                        <div class="direction go">
                            <img class="img" :src="DEFAULT_AVATAR_GO" />
                            <span>{{ d.direction.go }}</span>
                            <span class="divider">/</span>
                            <span>{{ d.direction.goP }}%</span>
                        </div>
                    </div>
                    <hr v-if="i !== v.maxDay.length - 1" />
                </div>
            </div>
        </div>
        <slot></slot>
    </el-tooltip>
</template>
<script>
import mixin from '../../../Tips/mixin.js';

export default {
    name: 'Statistic-Components-Plot-Tips-maxTip',
    mixins: [mixin],
    props: {
        yearData: Object,
    },
    data: () => ({}),
    computed: {
        v() {
            return this.yearData;
        },
    },
};
</script>
<style lang="sass" scoped>
@import '~@/views/Statistic/components/Tips/style.sass'

.title
    @include title
    padding: 0 10px // 撑大容器
.hr
    @include hr
.content
    margin: 0
    .row
        display: flex
        .day
            flex: 0 0 50%
            white-space: nowrap
        .count
            flex: 0 0 50%
            text-align: right
        .direction
            flex: 0 0 50%
            white-space: nowrap
            &.come
                padding-right: 5px
            &.go
                text-align: right
            .img
                @include avatar
            .divider
                padding: 0 2px
</style>
