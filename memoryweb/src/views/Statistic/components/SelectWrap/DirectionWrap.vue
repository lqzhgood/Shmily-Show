<template>
    <div class="directionWrap">
        <div class="actions">
            <div class="btnWrap" :style="btnsStyleFinally">
                <el-radio-group v-model="select" class="directionSelect">
                    <el-radio-button
                        :label="DIRECTION_TYPE_ALL"
                        title="全部聊天数据"
                        :class="{ unActive: select !== DIRECTION_TYPE_ALL }"
                    >
                        <img :src="DEFAULT_AVATAR_COME" class="icon" />
                        <img :src="DEFAULT_AVATAR_GO" class="icon" />
                    </el-radio-button>
                    <el-radio-button :label="DIRECTION_TYPE_COME" :class="{ unActive: select !== DIRECTION_TYPE_COME }">
                        <img :src="DEFAULT_AVATAR_COME" class="icon" title="聊天窗左边 Come" />
                    </el-radio-button>
                    <el-radio-button :label="DIRECTION_TYPE_GO" :class="{ unActive: select !== DIRECTION_TYPE_GO }">
                        <img :src="DEFAULT_AVATAR_GO" class="icon" title="聊天窗右边 Go" />
                    </el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <slot name="default" :directionType="select"></slot>
    </div>
</template>
<script>
import {
    DEFAULT_AVATAR_GO,
    DEFAULT_AVATAR_COME,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
} from '@/views/Statistic/const.js';
import mixin from './mixin.js';

export default {
    name: 'Statistic-Components-DirectionWrap',
    mixins: [mixin],
    data: () => ({
        DEFAULT_AVATAR_GO,
        DEFAULT_AVATAR_COME,
        DIRECTION_TYPE_ALL,
        DIRECTION_TYPE_COME,
        DIRECTION_TYPE_GO,

        select: DIRECTION_TYPE_ALL,
    }),
};
</script>
<style lang="sass" scoped>
@import ./style.sass

.directionWrap
    @include wrapStyle
</style>
