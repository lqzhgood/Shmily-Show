<template>
    <div :class="{ noPadding, isDev }" class="Msg-common-Wrap" :style="{ backgroundColor }">
        <div class="chatroom" :class="MSG_DIRECTION" v-if="isChatroom" @click="DevChatroom">
            <img src="/static/msg/source/Common/icon/chatroom.svg" class="icon-chatroom" data-is-icon />
            <span class="chatroomName">{{ chatroomName }}</span>
        </div>
        <slot></slot>
    </div>
</template>
<script>
import _ from 'lodash';
import styles from '@/styles/vars.module.sass';

export default {
    name: 'Msg-common-Wrap',
    inject: ['MSG', 'MSG_DIRECTION'],
    props: {
        noPadding: {
            type: Boolean,
            default: false,
        },
        backgroundColor: {
            type: String,
            default: styles.msgBackgroundColor,
        },
    },
    data: () => ({}),
    computed: {
        isDev() {
            return this.$store.getters['app/isDev'];
        },
        msg() {
            return this.MSG;
        },
        isChatroom() {
            if (!this.msg) return false;
            return !!_.get(this.msg, `$${this.msg.source}.data.chatroom`);
        },
        chatroomName() {
            if (!this.msg) return '';
            return _.get(this.msg, `$${this.msg.source}.data.chatroom.$name`);
        },
    },
    methods: {
        DevChatroom() {
            if (!this.msg) return;
            const o = _.get(this.msg, `$${this.msg.source}.key.chatroom`);
            console.log('chatroom', o);
        },
    },
};
</script>
<style lang="sass" scoped>
@import '~@/styles/vars.module.sass'

.Msg-common-Wrap
    padding: 10px
    text-align: left
    font-size: 14px
    line-height: 1.5em
    min-width: 100px
    min-height: 1em
    word-break: break-all
    word-wrap: break-word
    white-space: pre-wrap // 保留所有的空格和回车，但是允许折行。
    max-width: $msgBoxMaxWidth
    ::v-deep
        img, video ,audio
            vertical-align: bottom
            max-width: 100% // 图片不能设 min-width 因为表情只有那么大 , max-width 是为了不让竖图撑满屏幕
    &.noPadding
        padding: 0
        .chatroom
            margin: 0
    &.isDev
        ::v-deep
            img:not([data-is-icon]):not([alt])
                outline: 2px dashed #ff4d4f !important
            img[alt]:not([data-is-icon]):not([title])
                outline: 2px dashed blue !important
    .chatroom
        font-size: 12px
        line-height: 12px
        height: 12px
        padding: 5px
        background: #f6f8fa
        position: relative
        border: 1px solid #e1e4e8
        margin: -10px -10px 5px
        display: flex
        align-items: center
        border-bottom-left-radius: 6px
        border-bottom-right-radius: 6px
        .icon-chatroom
            max-height: 14px
            margin: 0 5px
        .chatroomName
            cursor: pointer
        &.right
            justify-content: flex-end
</style>
