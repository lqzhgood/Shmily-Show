<template>
    <div class="WechatMsgFooter">
        <img :src="icon" alt="icon" class="icon" data-is-icon v-if="icon" />
        <div>{{ text }}</div>
    </div>
</template>
<script>
export default {
    name: 'Msg-Wechat-components-footer',
    props: {
        icon: String,
        text: {
            require: true,
            type: String,
        },
    },
};
</script>
<style lang="sass" scoped>
.WechatMsgFooter
    border-top: 1px solid #e6e6e6
    padding: 10px 0
    display: flex
    color: #7d7d7d
    align-items: center
    .icon
        max-width: 16px
        max-height: 16px
        margin-right: 8px
</style>
