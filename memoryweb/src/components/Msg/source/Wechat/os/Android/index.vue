<template>
    <component :msg="msg" class="source-Wechat" :is="comp"></component>
</template>
<script>
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
} = require('./types.js');

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

            switch (type) {
                case Wechat_Android_type_消息:
                    // type == 1
                    // type == 49 && content.msg.appmsg.type == 1  带链接文本
                    return () => import('./components/1 49-1 text');
                case Wechat_Android_type_图片:
                    // type == 3
                    return () => import('./components/3 image');
                case Wechat_Android_type_语音:
                    // type == 34
                    return () => import('./components/34 audio');
                case Wechat_Android_type_撤回:
                    // type == 38
                    return () => import('./components/38 withdraw');
                case Wechat_Android_type_名片:
                    // type == 42
                    return () => import('./components/42 userCard');
                case Wechat_Android_type_视频:
                    // type == 43 || type == 62)
                    return () => import('./components/43 62 video');
                case Wechat_Android_type_位置:
                    // type == 48
                    return () => import('./components/48 location');
                case Wechat_Android_type_视频通话:
                    // type == 50
                    return () => import('./components/50 voip');
                case Wechat_Android_type_系统消息:
                    // type == 10000
                    return () => import('./components/10000 system');
                case Wechat_Android_type_自定义表情:
                    // type = 47(微信商店的) 49-8(自己发的)
                    return () => import('./components/47 49-8 emoji');
                case Wechat_Android_type_微信运动:
                    return () => import('./components/49-2 sport');
                case Wechat_Android_type_分享:
                    // 49-3 49-5
                    return () => import('./components/49-3 49-5 share');
                case Wechat_Android_type_文件:
                    return () => import('./components/49-6 file');
                case Wechat_Android_type_位置共享:
                    // 49-17
                    return () => import('./components/49-17 locationShare');
                case Wechat_Android_type_聊天记录:
                    return () => import('./components/49-19 chatRecord');
                case Wechat_Android_type_小程序:
                    // 49-33 40-36
                    return () => import('./components/49-33 40-36 app');
                case Wechat_Android_type_转账:
                    // 49-2000
                    return () => import('./components/49-2000 pay');
                case Wechat_Android_type_红包:
                    // 49-2001
                    return () => import('./components/49-2001 hongBao');
                default:
                    return () => import('@/components/Msg/source/Unknown.vue');
            }
        },
    },
};
</script>
<style lang="sass"></style>
