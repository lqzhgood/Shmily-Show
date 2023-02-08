<template>
    <div :class="{ noPadding, isDev }" class="Msg-common-Wrap">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'Msg-common-Wrap',
    props: {
        noPadding: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({}),
    computed: {
        isDev() {
            return this.$store.getters['app/isDev'];
        },
    },
};
</script>
<style lang="sass" scoped>
@import '~@/styles/vars.module.sass'

.Msg-common-Wrap
    padding: 10px
    background-color: $msgBackgroundColor
    text-align: left
    font-size: 14px
    line-height: 1.5em
    min-width: 100px
    min-height: 1em
    word-break: break-all
    word-wrap: break-word
    white-space: pre-wrap // 保留所有的空格和回车，但是允许折行。
    max-width: 340px
    ::v-deep
        img, video ,audio
            vertical-align: bottom
            max-width: 100% // 图片不能设 min-width 因为表情只有那么大 , max-width 是为了不让竖图撑满屏幕
    &.noPadding
        padding: 0
    &.isDev
        ::v-deep
            img:not([data-is-icon]):not([alt])
                outline: 2px dashed #ff4d4f !important
            img[alt]:not([data-is-icon]):not([title])
                outline: 2px dashed blue !important
</style>
