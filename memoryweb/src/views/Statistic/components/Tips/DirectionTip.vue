<template>
    <el-tooltip :effect="effect" v-bind="$attrs" v-if="$slots.title || direction">
        <div slot="content">
            <div class="title" v-if="$slots.title">
                <slot name="title"></slot>
            </div>
            <hr class="hr" />
            <div class="content" v-if="direction">
                <div class="row" style="margin-bottom: 5px">
                    <img class="img" :src="DEFAULT_AVATAR_COME" />
                    <div class="value">
                        <span>{{ direction.come }} {{ unit }}</span>
                        <span class="divider">/</span>
                        <span class="percent">
                            {{ direction.comeP }}
                            <small>%</small>
                        </span>
                    </div>
                </div>
                <div class="row">
                    <img class="img" :src="DEFAULT_AVATAR_GO" />
                    <div class="value">
                        <span>{{ direction.go }} {{ unit }}</span>
                        <span class="divider">/</span>
                        <span class="percent">
                            {{ direction.goP }}
                            <small>%</small>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <slot></slot>
    </el-tooltip>

    <div v-else>
        <slot></slot>
    </div>
</template>
<script>
import mixin from './mixin.js';

export default {
    name: 'Statistic-Components-Plot-Tips-directionTip',
    mixins: [mixin],
    props: {
        direction: { type: Object, require: true },
    },
    data: () => ({}),
};
</script>
<style lang="sass" scoped>
@import '~@/views/Statistic/components/Tips/style.sass'


.title
    @include title
.hr
    @include hr
.content
    @include content
</style>
