<template>
    <MsgWrap noPadding>
        <div class="MobileQQ-Android-chatRecord">
            <div class="source click" @click="dialogVisible = true">{{ source }}</div>
            <div class="list">
                <div class="text title" v-if="title" v-html="title"></div>
                <div class="text" v-for="(t, i) in list" :key="i" v-html="t.$html"></div>
            </div>
            <div class="footer">
                <div class="summary click" @click="dialogVisible = true">{{ summary }}</div>
                <div class="des">{{ des }}</div>
            </div>
        </div>

        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            destroy-on-close
            class="MobileQQ-Android-chatRecord-chatList"
        >
            <div slot="title">
                <div>
                    <span v-if="des">{{ des }} -</span>
                    {{ source }}
                </div>
                <hr />
            </div>
            <div class="title" v-if="title" v-html="title"></div>
            <div class="list">
                <div :key="i" class="chatWrap" v-for="(t, i) in list">
                    <div class="left">
                        <img src="/static/msg/source/MobieQQ/img/person.jpg" class="avatar" />
                    </div>
                    <div class="center">
                        <div class="row">
                            <div class="info">
                                <span class="name">$name</span>
                                <span class="time">$time</span>
                            </div>
                            <div v-html="t.$html"></div>
                            <hr />
                        </div>
                    </div>
                    <div class="right"></div>
                </div>
            </div>
            <Tips v-if="tip" style="margin-bottom: 20px">{{ tip }}</Tips>
            <Tips>完整记录需要深挖数据库，待开发...</Tips>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </MsgWrap>
</template>
<script>
import Tips from '@/components/Tips/index';

import { MobileQQ_Android_type__分享_2011, MobileQQ_Android_type__分享_5008 } from '../types.js';

export default {
    name: 'Msg-MobileQQ-Android-chatRecord',
    props: {
        msg: Object,
    },
    data: () => ({
        dialogVisible: false,
    }),
    computed: {
        data() {
            return this.msg.$MobileQQ.data;
        },
        type() {
            return this.msg.$MobileQQ.type;
        },
        chatData() {
            const o = {
                des: '', // [转发多条消息]
                title: '', // 群聊的聊天记录
                source: '', // 转发自: 小黑子技术交流群-Geforce GT...
                list: [],
                summary: '', // 查看2条转发消息
                tip: '', // 你的QQ暂不支持查看[转发多条消息]，请期待后续版本。
            };

            switch (this.type) {
                case MobileQQ_Android_type__分享_2011: {
                    //   {
                    //     "fileType": "viewMultiMsg",
                    //     "des": "[转发多条消息]",
                    //     "itemKey": "item",
                    //      “$titleObject” :  {}  如果第一条 list size === 34 就会单独提取到这里，结构和 list 里面的一致， 所以这个属性不一定有
                    //     "list": [
                    //         {
                    //             "titleKey": "title",
                    //             "color": "",
                    //             "size": "",
                    //             "text": "꧁༺ۣ消逝ۣ༒ۣ星系ۣ...:  [图片]",
                    //             "v1": "",
                    //             "v2": "",
                    //             "$html": "꧁༺ۣ消逝ۣ༒ۣ星系ۣ...:  [图片]"
                    //         },
                    //         {
                    //             "titleKey": "title",
                    //             "color": "",
                    //             "size": "",
                    //             "text": "꧁༺ۣ消逝ۣ༒ۣ星系ۣ...:  [图片]",
                    //             "v1": "",
                    //             "v2": "",
                    //             "$html": "꧁༺ۣ消逝ۣ༒ۣ星系ۣ...:  [图片]"
                    //         }
                    //     ],
                    //     "hrValue": "hr",
                    //     "falseValue": "false",
                    //     "summaryKey": "summary",
                    //     "summaryColor": "",
                    //     "summarySize": "",
                    //     "summaryValue": "查看2条转发消息",
                    //     "source": "转发自: 小黑子技术交流群-Geforce GT...",
                    //     "resid": "JjK5qRqoaVZv+HZSM9ujBvcccAgVBBJmbU9voZcw8SfpfaB+Lex8+d73n+nD6Wrm",
                    //     "uuid": "7229972690925419558",
                    //     "v1": "",
                    //     "tip": "你的QQ暂不支持查看[转发多条消息]，请期待后续版本。",
                    //     "other": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000����\u0000\u0000����\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0007�\u0000\u0000\u0000\u0000"
                    // }

                    o.des = this.data.des;
                    o.title = this.data?.$titleObject?.$html;
                    o.summary = this.data.summaryValue;
                    o.list = this.data.list;
                    o.source = this.data.source;
                    o.tip = this.data.tip;

                    break;
                }

                case MobileQQ_Android_type__分享_5008: {
                    // "news": [
                    //     {
                    //         "text": "������������有些人走着走着...:  气温真的好高",
                    //         "$html": "������������有些人走着走着...:  气温真的好高"
                    //     },
                    // ],
                    // "uniseq": "7239854612624783193",
                    // "resid": "9OAbG4QXoyBx2ozYsGnJQ6y6J/YZtraTp8nfsTpbVykfVbMMd28O/sotFInkxPmD",
                    // "summary": "查看34条转发消息",
                    // "source": "群聊的聊天记录"

                    o.source = this.data.source;
                    o.list = this.data.news;
                    o.summary = this.data.summary;
                    break;
                }
            }
            return o;
        },
        des() {
            return this.chatData.des;
        },
        title() {
            return this.chatData.title;
        },
        source() {
            return this.chatData.source;
        },
        list() {
            return this.chatData.list;
        },
        summary() {
            return this.chatData.summary;
        },
        tip() {
            return this.chatData.tip;
        },
    },
    components: {
        Tips,
    },
};
</script>
<style lang="sass">
.MobileQQ-Android-chatRecord-chatList
    .el-dialog__body
        padding-top: 10px
    .title
        font-size: 16px
        font-weight: bold
        text-align: center
        margin-bottom: 10px
    .chatWrap
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
            .info
                display: flex
                .name
                    flex: 1 1 auto
                .time
                    flex: 0 1 140px
                    text-align: right
                    font-size: 12px
            img
                max-width: 140px
        &:last-child
            .center .row hr
                opacity: 0
</style>
<style lang="sass" scoped>
@import '~@/styles/vars.module.sass'

.MobileQQ-Android-chatRecord
    background: #fff
    width: $msgBoxMaxWidth
    padding: 10px 10px 0 10px
    box-sizing: border-box
    .click:hover
        cursor: pointer
        text-decoration: underline

    .source
        font-size: 14px
    .list
        margin: 10px 5px
        font-size: 12px
        color: #9c9c9c
        .text
            line-height: 14px
            margin-bottom: 10px
            &:last-child
                margin-bottom: 0
            &.title
                font-weight: bold
                color: #666
    .footer
        font-size: 12px
        border-top: 1px solid #e4e4e4
        color: #9c9c9c
        display: flex
        justify-content: space-between
        padding: 1px 0
</style>
