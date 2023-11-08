<template>
    <div :class="msg.direction === 'come' ? 'left' : 'right'" class="msg_inner">
        <!-- v-img-attr-extra 放到 {msg} 上面能节省一次计算 ，放到 msg_inner 上面会计算2次。 msg_inner 插入 和 {msg} 插入 -->
        <Wechat_Android :msg="msg" v-if="mc.isWechat(msg)" />
        <QQ :data-id="msg.id" :msg="msg" v-else-if="mc.isQQ(msg)" v-img-attr-extra v-img-is-face="'/data/qq-pc/face/'" />

        <MobileQQ_Android :msg="msg" v-else-if="mc.isMobileQQ_Android(msg)" />
        <MobileQQ_s60v3 :msg="msg" v-else-if="mc.isMobileQQ_s60v3(msg)" v-img-attr-extra />

        <SMS :msg="msg" v-else-if="mc.isSMS(msg)" v-img-attr-extra />
        <CallLog :msg="msg" v-else-if="mc.isCallLog(msg)" v-img-attr-extra />
        <Camera :msg="msg" v-else-if="mc.isCamera(msg)" v-img-attr-extra />
        <Email :msg="msg" v-else-if="mc.isEmail(msg)" v-img-attr-extra />

        <!-- 兜底 -->
        <MUnknown :msg="msg" v-else v-img-attr-extra />
    </div>
</template>
<script>
const msgCategory = require('@/components/Msg/utils/isSource.js');

export default {
    name: 'Msg-MsgInner',
    provide() {
        return { MSG: this.msg, MSG_DIRECTION: this.MSG_DIRECTION };
    },
    props: {
        msg: Object,
    },
    data: () => ({
        mc: msgCategory,
    }),
    computed: {
        isDev() {
            return this.$store.getters['app/isDev'];
        },
    },
    components: {
        MUnknown: () => import('../source/Unknown.vue'),
        Camera: () => import('../source/Camera/index.vue'),
        CallLog: () => import('../source/CallLog/index.vue'),
        Email: () => import('../source/Email/index.vue'),
        QQ: () => import('../source/QQ/index.vue'),
        MobileQQ_Android: () => import('../source/MobileQQ/os/Android/index.vue'),
        MobileQQ_s60v3: () => import('../source/MobileQQ/os/s60v3/index.vue'),
        SMS: () => import('../source/SMS'),
        Wechat_Android: () => import('../source/Wechat/os/Android/index.vue'),
    },
};
</script>
<style lang="sass" scoped>
.msg_inner
    border-radius: 0 4px 4px 4px
    overflow: auto
    &.right
        border-radius: 4px 0 4px 4px
</style>
