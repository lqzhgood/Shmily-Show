<template>
    <MsgWrap noPadding>
        <div @click="dialogVisible = true" class="wechat-chatRecord" target="_blank">
            <h4>{{ info }}</h4>
            <div class="description" v-html="desc"></div>
            <WechatMsgFooter text="收藏" icon="/static/icon/type/Wechat-收藏.png" />

            <el-dialog :append-to-body="true" :fullscreen="true" title="笔记详情" :visible.sync="dialogVisible" class="dialog-collect-list">
                <div :key="i" class="item" v-for="(v, i) in datalist">
                    <div class="left"></div>
                    <div class="center">
                        <div class="row" v-if="v.type === 'html'" v-html="v.value || '-'"></div>
                        <div class="row" v-if="v.type === 'file'">
                            <img :src="v.value" v-if="fileType(v) === 'image'" @click="openPre(v.value)" />
                            <video controls :src="v.value" v-else-if="fileType(v) === 'video'"></video>
                            <audio controls :src="v.value" v-else-if="fileType(v) === 'audio'"></audio>
                            <a :href="v.value" v-else>
                                <div>{{ v.value || '-' }}</div>
                            </a>
                        </div>
                    </div>
                    <div class="right"></div>
                </div>
            </el-dialog>
        </div>
    </MsgWrap>
</template>
<script>
import _ from 'lodash';
import WechatMsgFooter from './components/Footer';

const { EXT_IMAGE, EXT_AUDIO, EXT_VIDEO } = require('@/utils/const');

export default {
    name: 'Msg-Wechat-chatRecord',
    props: {
        msg: Object,
    },
    data: () => ({
        dialogVisible: false,
    }),
    computed: {
        data() {
            return this.msg.$Wechat.data;
        },
        desc() {
            return this.data.desc;
        },
        info() {
            return this.data.info;
        },
        datalist() {
            return _.get(this.data, 'list', []);
        },
    },
    methods: {
        fileType(v) {
            if (v.fileParse) {
                if (EXT_IMAGE.includes(v.fileParse.ext)) {
                    return 'image';
                }
                if (EXT_VIDEO.includes(v.fileParse.ext)) {
                    return 'video';
                }
                if (EXT_AUDIO.includes(v.fileParse.ext)) {
                    return 'audio';
                }
            }
            return null;
        },
        openPre(url) {
            this.$hevueImgPreview(url);
        },
    },
    components: {
        WechatMsgFooter,
    },
};
</script>
<style lang="sass">
.dialog-collect-list
    .item
        display: flex
        .left
            flex: 0 1 50px
            padding-right: 10px
            box-sizing: border-box
            .avatar
                max-width: 40px
        .right
            flex: 0 0 50px
        .center
            flex: 1 1 auto
            .row
                margin-bottom: 20px
            img
                max-width: 300px
</style>
<style lang="sass" scoped>
.wechat-chatRecord
    width: 240px
    min-height: 40px
    padding: 10px
    border-radius: 2px
    padding-bottom: 0
    text-decoration: none
    color: #333
    cursor: pointer
    display: inline-block
    background: #fff
    h4
        font-size: 15px
        margin: 0
        font-weight: 500
        padding-bottom: 0
        word-wrap: break-word
    .description
        min-height: 50px
        font-size: 12px
        color: #9c9c9c
        margin: 0
        word-break: break-all
    .bottom
        line-height: 22px
        font-size: 12px
        color: #999
        border-top: 1px solid #e4e4e4
        display: flex
</style>
