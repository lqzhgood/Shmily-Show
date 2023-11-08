<template>
    <MsgWrap class="wechat-system" noPadding>
        <div class="message-tip" v-html="msg.html"></div>
    </MsgWrap>
</template>
<script>
export default {
    name: 'Msg-Wechat-system-joinGroup',
    props: {
        msg: Object,
    },
    data: () => ({}),
};
</script>
<style lang="sass" scoped>
.wechat-system
    background-color: #F1F3F4
    .message-tip
        display: inline-block
        background-color: rgba(0, 0, 0, 0.1)
        border-radius: 2px
        padding: 10px
        line-height: 18px
        font-size: 12px
</style>
