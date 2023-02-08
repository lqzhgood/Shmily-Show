<template>
    <el-divider>
        <div class="titleWrap">
            <slot name="default"></slot>
        </div>
    </el-divider>
</template>
<script>
export default {
    name: 'Page-Statistic-Contrast-Components-emotion-Components-totalTitle',
    props: {
        count: {
            type: [String, Number],
            default: 0,
        },
    },
};
</script>
<style lang="sass" scoped>
.titleWrap
    text-align: center
    white-space: nowrap
    justify-content: center
    align-items: center
    display: flex
    .avatar
        width: 16px
        height: 16px
        margin-right: 10px
        display: inline-block
    .label,.count
        font-size: 12px
    .label
        color: #99a9bf
        margin-right: 10px
    .count
        margin-right: 10px
        &:last-child
            margin-right: 0
</style>
