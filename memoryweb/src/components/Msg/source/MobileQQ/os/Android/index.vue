<template>
    <component :msg="msg" class="source-MobileQQ Android" :is="comp"></component>
</template>
<script>
const {
    MobileQQ_Android_type_消息,
    MobileQQ_Android_type_系统消息,
    MobileQQ_Android_type_撤回,
    MobileQQ_Android_type_动作,
    MobileQQ_Android_type_位置,
    MobileQQ_Android_type_图片,
    MobileQQ_Android_type_分享,
    MobileQQ_Android_type_自定义表情,
    MobileQQ_Android_type_视频通话,
    MobileQQ_Android_type_视频,
    MobileQQ_Android_type_语音,
    MobileQQ_Android_type_文件,
} = require('./types');

const {
    is_MobileQQ_Android_type_消息, // eslint-disable-line no-unused-vars
    is_MobileQQ_Android_type_系统消息, // eslint-disable-line no-unused-vars
    is_MobileQQ_Android_type_撤回, // eslint-disable-line no-unused-vars
    is_MobileQQ_Android_type_动作, // eslint-disable-line no-unused-vars
    is_MobileQQ_Android_type_位置, // eslint-disable-line no-unused-vars
    is_MobileQQ_Android_type_图片, // eslint-disable-line no-unused-vars
    is_MobileQQ_Android_type_分享, // eslint-disable-line no-unused-vars
    is_MobileQQ_Android_type_自定义表情, // eslint-disable-line no-unused-vars
    is_MobileQQ_Android_type_视频通话, // eslint-disable-line no-unused-vars
    is_MobileQQ_Android_type_视频, // eslint-disable-line no-unused-vars
    is_MobileQQ_Android_type_语音, // eslint-disable-line no-unused-vars
    is_MobileQQ_Android_type_文件, // eslint-disable-line no-unused-vars
    is_MobileQQ_Android_type_混合消息,
} = require('./isTypes');

export default {
    name: 'Source-MobileQQ-Android',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        comp() {
            const type = this.msg.type;
            if (is_MobileQQ_Android_type_混合消息(this.msg)) {
                return () => import('./components/mixMsg.vue');
            }
            // 理论上应该用 is_MobileQQ_Android_type_xxx
            // 考虑到内部使用还是性能优先吧
            switch (type) {
                // 修改属性 Key 时注意同时查看对应的位置是否需要修改
                // src\components\Dev\Msg\components\rules\MobileQQ-Android.js
                case MobileQQ_Android_type_消息:
                case MobileQQ_Android_type_系统消息:
                case MobileQQ_Android_type_撤回:
                case MobileQQ_Android_type_动作:
                    return () => import('./components/text/index.vue');
                case MobileQQ_Android_type_位置:
                    return () => import('./components/location.vue');
                case MobileQQ_Android_type_图片:
                    return () => import('./components/image');
                case MobileQQ_Android_type_分享:
                    return () => import('./components/share/index.vue');
                case MobileQQ_Android_type_自定义表情:
                    return () => import('./components/emoticon.vue');
                case MobileQQ_Android_type_视频通话:
                    return () => import('./components/voip.vue');
                case MobileQQ_Android_type_视频:
                    return () => import('./components/video');
                case MobileQQ_Android_type_语音:
                    return () => import('./components/audio');
                case MobileQQ_Android_type_文件:
                    return () => import('./components/file');
                default:
                    return () => import('@/components/Msg/source/Unknown.vue');
            }
        },
    },
};
</script>
<style lang="sass" scoped></style>
