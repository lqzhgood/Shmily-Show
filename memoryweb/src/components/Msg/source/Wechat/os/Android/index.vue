<template>
    <component :msg="msg" class="source-Wechat" :is="comp"></component>
</template>
<script>
// prettier-ignore
const {
    Wechat_Android_type_分享,
    Wechat_Android_type_红包,
    Wechat_Android_type_聊天记录,
    Wechat_Android_type_名片,
    Wechat_Android_type_视频,
    Wechat_Android_type_视频通话,
    Wechat_Android_type_图片,
    Wechat_Android_type_微信运动,
    Wechat_Android_type_位置,
    Wechat_Android_type_位置共享,
    Wechat_Android_type_文件,
    Wechat_Android_type_系统消息,
    Wechat_Android_type_消息,
    Wechat_Android_type_小程序,
    Wechat_Android_type_语音,
    Wechat_Android_type_转账,
    Wechat_Android_type_自定义表情,
    Wechat_Android_type_撤回,
    Wechat_Android_type_视频号,
    Wechat_Android_type_收藏,
} = require('./types.js');

const { is_Wechat_Android_type__分享_视频, is_Wechat_Android_type__系统消息_群聊_入群消息 } = require('./isTypes.js');

export default {
    name: 'msg-source-wechat',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        type() {
            return this.msg.type;
        },
        comp() {
            const type = this.type;
            if (is_Wechat_Android_type__分享_视频(this.msg)) {
                return () => import('./components/shareVideo.vue');
            } else if (is_Wechat_Android_type__系统消息_群聊_入群消息(this.msg)) {
                return () => import('./components/system/JoinGroup.vue');
            }

            switch (type) {
                case Wechat_Android_type_消息:
                    // type == 1
                    // type == 49 && content.msg.appmsg.type == 1  带链接文本
                    return () => import('./components/text');
                case Wechat_Android_type_图片:
                    // type == 3
                    return () => import('./components/image');
                case Wechat_Android_type_语音:
                    // type == 34
                    return () => import('./components/audio');
                case Wechat_Android_type_撤回:
                    // type == 38
                    return () => import('./components/withdraw');
                case Wechat_Android_type_名片:
                    // type == 42
                    return () => import('./components/userCard');
                case Wechat_Android_type_视频:
                    // type == 43 || type == 62)
                    return () => import('./components/video');
                case Wechat_Android_type_位置:
                    // type == 48
                    return () => import('./components/location');
                case Wechat_Android_type_视频通话:
                    // type == 50
                    return () => import('./components/voip');
                case Wechat_Android_type_系统消息:
                    // type == 10000
                    return () => import('./components/system/common.vue');
                case Wechat_Android_type_自定义表情:
                    // type = 47(微信商店的) 49-8(自己发的)
                    return () => import('./components/emoji');
                case Wechat_Android_type_微信运动:
                    return () => import('./components/sport');
                case Wechat_Android_type_分享:
                    // 49-3 49-5
                    return () => import('./components/share');
                case Wechat_Android_type_文件:
                    return () => import('./components/file');
                case Wechat_Android_type_位置共享:
                    // 49-17
                    return () => import('./components/locationShare');
                case Wechat_Android_type_聊天记录:
                    return () => import('./components/chatRecord');
                case Wechat_Android_type_小程序:
                    // 49-33 40-36
                    return () => import('./components/app');
                case Wechat_Android_type_转账:
                    // 49-2000
                    return () => import('./components/pay');
                case Wechat_Android_type_红包:
                    // 49-2001
                    return () => import('./components/hongBao');
                case Wechat_Android_type_视频号:
                    return () => import('./components/videoChannel.vue');
                case Wechat_Android_type_收藏:
                    return () => import('./components/collect.vue');
                default:
                    return () => import('@/components/Msg/source/Unknown.vue');
            }
        },
    },
};
</script>
<style lang="sass"></style>
