<template>
    <div class="countTypeWrap">
        <div class="actions">
            <div class="btnWrap" :style="btnsStyleFinally">
                <el-radio-group v-model="select" class="directionSelect">
                    <el-radio-button :label="COUNT_DB_TYPE_NUM" :class="{ unActive: select !== COUNT_DB_TYPE_NUM }">
                        <span>次数</span>
                    </el-radio-button>
                    <el-radio-button :label="COUNT_DB_TYPE_WORDS" :class="{ unActive: select !== COUNT_DB_TYPE_WORDS }">
                        <span>字数</span>
                    </el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <slot name="default" :countType="select"></slot>
    </div>
</template>
<script>
import { COUNT_DB_TYPE_NUM, COUNT_DB_TYPE_WORDS } from '@/views/Statistic/const.js';
import mixin from './mixin.js';

export default {
    name: 'Statistic-Components-countType',
    mixins: [mixin],
    data: () => ({
        COUNT_DB_TYPE_NUM,
        COUNT_DB_TYPE_WORDS,

        select: COUNT_DB_TYPE_NUM,
    }),
};
</script>
<style lang="sass" scoped>
@import ./style.sass

.countTypeWrap
    @include wrapStyle
</style>
