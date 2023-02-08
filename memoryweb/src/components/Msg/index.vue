<template>
    <article :class="msg.direction === 'come' ? 'left' : 'right'" :data-id="msg.id" class="row" ref="msg">
        <InfoPopover :msg="msg">
            <Avatar :msg="msg" class="avatar" />
        </InfoPopover>
        <div class="msg">
            <img :src="`./static/icon/source/${msg.source}-${msg.type}.png`" class="source" />

            <!-- 装饰用三角形 -->
            <div class="triangle"></div>

            <MsgInner :msg="msg" @click.native.ctrl.stop="isDev && devCopyImg($event)" />

            <!-- dev -->
            <DevFlag :listIndex="listIndex" :msg="msg" :msgPart="msgPart" :msgPartIndex="msgPartIndex" v-if="isDev" />
            <ModifyMsg :msg="msg" v-if="isDev" />
            <CopyAsset :assetSrc.sync="devOpenCopyAssetSrc" :msg="msg" v-if="isDev && devOpenCopyAssetSrc" />
        </div>
    </article>
</template>
<script>
import { Message } from 'element-ui';
import { copyText } from '@/utils/index';

import Avatar from './components/Avatar';
import MsgInner from './components/MsgInner';
import InfoPopover from './components/InfoPopover';

export default {
    name: 'Query-Msg',
    mounted() {
        this.mountedFN && this.mountedFN(this.$refs.msg);
    },
    props: {
        msg: {
            type: Object,
            require: true,
        },
        msgPartIndex: {
            type: Number,
            require: true,
        },
        listIndex: Number, // 总的列表 index
        msgPart: {
            type: Array,
            require: true,
        },
        mountedFN: Function,
        beforeDestroyFn: Function,
    },
    data: () => ({
        devOpenCopyAssetSrc: null,
    }),
    computed: {
        isDev() {
            return this.$store.getters['app/isDev'];
        },
    },
    methods: {
        devCopyImg($e) {
            const el = $e.target;
            if (!['img', 'video', 'audio'].includes(el.nodeName.toLowerCase())) return;
            this.devOpenCopyAssetSrc = el.src;
        },
        copy(msg) {
            const path = location.href.split('?')[0];
            const url = `${path}?id=${encodeURIComponent(msg.id)}`;
            copyText(
                url,
                () => {
                    Message.success(`复制链接成功 ${msg.day} ${msg.time}`);
                },
                () => {
                    Message.error(`复制链接失败 ${url}`);
                },
            );
        },
    },
    beforeDestroy() {
        this.beforeDestroyFn && this.beforeDestroyFn(this.$refs.msg);
    },
    components: {
        Avatar,
        MsgInner,
        InfoPopover,

        DevFlag: () => import('@/components/Dev/Msg/DevFlag'),
        ModifyMsg: () => import('@/components/Dev/Msg/ModifyMsg'),
        CopyAsset: () => import('@/components/Dev/Msg/CopyAsset'),
    },
};
</script>

<style lang="sass" scoped>
@import '~@/styles/vars.module.sass'

.row
    display: flex
    justify-content: flex-start
    margin-bottom: $msgRow_margin_bottom
    align-items: flex-start
    .avatar
        margin-right: 5px
        position: relative
    .msg
        display: flex
        justify-content: space-between
        position: relative
        transition: all 0.3s
        filter: drop-shadow( 0 1px 4px rgba(0, 0, 0, .12))
        max-width: 80%
        &:hover
            filter: drop-shadow( 0 2px 12px rgba(0, 0, 0, 0.3))
        .source
            display: inline-block
            position: absolute
            right: -5px
            top: -5px
            // opacity: 0.7
            max-width: 20px
            z-index: 10
        .triangle
            width: 0
            height: 0
            border-style: solid
            border-width: 0 10px 15px 0
            border-color: transparent $msgBackgroundColor transparent transparent

.row.right
    flex-direction: row-reverse
    .avatar
        margin-right: 0
        margin-left: 5px
    .msg
        flex-direction: row-reverse
        .source
            position: absolute
            left: -5px
        .triangle
            width: 0
            height: 0
            border-style: solid
            border-width: 15px 10px 0 0
            border-color: $msgBackgroundColor transparent transparent transparent
</style>
