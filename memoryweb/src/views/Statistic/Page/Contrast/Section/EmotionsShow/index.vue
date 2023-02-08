<template>
    <CardWrap class="emotionsWrap">
        <div class="btns">
            <el-radio-group v-model="directionType" class="directionSelect" data-size="nano">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="comeAndGo" class="icon-radio">
                    <img :src="DEFAULT_AVATAR_COME" class="icon" />
                    <img :src="DEFAULT_AVATAR_GO" class="icon" />
                </el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="dbType" data-size="nano">
                <el-radio-button :label="EMOTIONS_DB_TYPE_PACK_NAME">表情包排序</el-radio-button>
                <el-radio-button :label="EMOTIONS_DB_TYPE_DES">表情排序</el-radio-button>
            </el-radio-group>
        </div>
        <EmotionsAll v-if="directionType === 'all'" :dbType="dbType" />
        <EmotionsDiff v-else-if="directionType === 'comeAndGo'" :dbType="dbType" />
    </CardWrap>
</template>
<script>
import AsyncComponent from '@/components/AsyncComponent';
import {
    DEFAULT_AVATAR_GO,
    DEFAULT_AVATAR_COME,
    EMOTIONS_DB_TYPE_PACK_NAME,
    EMOTIONS_DB_TYPE_DES,
} from '@/views/Statistic/const.js';

export default {
    name: 'Statistic-Page-Contrast-Section-index',
    data: () => ({
        DEFAULT_AVATAR_GO,
        DEFAULT_AVATAR_COME,
        EMOTIONS_DB_TYPE_PACK_NAME,
        EMOTIONS_DB_TYPE_DES,

        directionType: 'all',
        dbType: EMOTIONS_DB_TYPE_PACK_NAME,
    }),
    components: {
        EmotionsAll: () => AsyncComponent(import('./all.vue')),
        EmotionsDiff: () => AsyncComponent(import('./diff.vue')),
    },
};
</script>
<style lang="sass" scoped>
.emotionsWrap
    position: relative
    min-height: 300px
    .btns
        display: flex
        justify-content: space-between
        .directionSelect
            .icon-radio
                ::v-deep
                    .el-radio-button__inner
                        padding: 3px 10px 2px
                .icon
                    width: 16px
                    height: 16px
</style>
