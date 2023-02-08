<template>
    <div :class="{ paddingYear: hasPadding }" class="commentWrap">
        <div class="comment">
            <div class="header" v-if="type.includes(COMMENT_TYPE_HEADER)">
                <div class="line top"></div>
                <span @click="logComment" class="time">{{ comment.time }}</span>
                <span class="actions">
                    <i @click="preComment()" class="el-icon-upload2" title="上一条评论"></i>
                    <i @click="nextComment()" class="el-icon-download" title="下一条评论"></i>
                    <i @click="showDialog = true" class="el-icon-full-screen" title="放大"></i>
                </span>
            </div>
            <div class="content" v-if="type.includes(COMMENT_TYPE_CONTENT)">
                <component :is="commentVNodeHasInnerId()" v-if="comment.vNodeTmpl"></component>
                <div :inner-html.prop="comment.html" v-else-if="comment.html"></div>
            </div>

            <div
                :class="{ onlyLink: isLonelyLink }"
                class="doublyLink"
                v-if="type.includes(COMMENT_TYPE_INNER_LINK_FROM)"
            >
                <el-popover :key="fId" placement="left" trigger="hover" v-for="fId in innerIdFromArr" width="340">
                    <MsgPopover :msgId="fId" />
                    <div slot="reference">
                        <a :href="`/#/query?id=${fId}`" innerlink target="_blank">{{ makeInnerTextById(fId) }}</a>
                    </div>
                </el-popover>
            </div>

            <div class="footer" v-if="type.includes(COMMENT_TYPE_FOOTER) || isLonelyLink">
                <div class="line bottom"></div>
            </div>
        </div>

        <el-dialog
            :title="`评论 - ${comment.time} - 第${comment.index}条`"
            :visible.sync="showDialog"
            class="dialog-comment-detail"
            width="50%"
        >
            <div class="content" v-html="comment.html"></div>
            <span class="dialog-footer" slot="footer">
                <el-button @click="showDialog = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash';
import { Message } from 'element-ui';
import { TMPL_HTML_COMMENT_INNER_LINK, TMPL_VNODE_COMMENT_INNER_LINK_ID_POPOVER, CONSOLE_STYLE } from '@/utils/const';
import MsgPopover from './components/MsgPopover.vue';

const { MSG_SLICE, IS_COMMENT_INNER_LINK_FLAG, makeInnerTextById } = require('@/common.js');
const {
    COMMENT_TYPE_HEADER,
    COMMENT_TYPE_CONTENT,
    COMMENT_TYPE_INNER_LINK_FROM,
    COMMENT_TYPE_FOOTER,
} = require('./const.js');

export default {
    name: 'Query-Comment',
    props: {
        paddingYear: Boolean,
        comment: Object,
        listIndex: Number,
    },
    data: () => ({
        COMMENT_TYPE_HEADER,
        COMMENT_TYPE_CONTENT,
        COMMENT_TYPE_INNER_LINK_FROM,
        COMMENT_TYPE_FOOTER,
        showDialog: false,
    }),
    computed: {
        isDev() {
            return this.$store.getters['app/isDev'];
        },
        msgAll() {
            return this.$store.state.msgAll;
        },
        msgS() {
            return _.head(this.msgAll);
        },
        msgE() {
            return _.last(this.msgAll);
        },
        commentAll() {
            return this.$store.state.commentAll;
        },
        isLonelyLink() {
            return _.isEqual(this.type, [COMMENT_TYPE_INNER_LINK_FROM]);
        },
        hasPadding() {
            return this.type.includes(COMMENT_TYPE_HEADER) || this.isLonelyLink ? this.paddingYear : false;
        },
        html() {
            return this.comment.html;
        },
        type() {
            return this.comment.type || [];
        },
        vNodeHtml() {
            const vNodeHtml = this.innerIdToArr.reduce((pre, id, index) => {
                const msg = this.findMsgById(id);

                let tmpl;
                if (msg) {
                    tmpl = TMPL_VNODE_COMMENT_INNER_LINK_ID_POPOVER(id, index);
                } else {
                    tmpl = TMPL_HTML_COMMENT_INNER_LINK(id);

                    if (this.isDev) {
                        if (MSG_SLICE) {
                            const currToMsgIdMs = new Date(makeInnerTextById(id)).getTime();
                            if (currToMsgIdMs > this.msgS.ms && currToMsgIdMs < this.msgE.ms) {
                                CONSOLE_STYLE.danger('没有找到信息', msg, id);
                            } else {
                                // 目标信息肯恩在分割信息以外 不存在正常
                            }
                        } else {
                            CONSOLE_STYLE.danger('没有找到信息', msg, id);
                        }
                    }
                }
                return pre.replace(IS_COMMENT_INNER_LINK_FLAG, tmpl);
            }, this.comment.vNodeTmpl);

            return vNodeHtml;
        },
        innerIdToArr() {
            return this.comment?.innerId?.to || [];
        },
        innerIdFromArr() {
            return this.comment?.innerId?.from || [];
        },
    },
    methods: {
        findMsgById(id) {
            return this.msgAll.find(msg => msg.id === id);
        },
        makeInnerTextById(id) {
            return makeInnerTextById(id);
        },
        commentVNodeHasInnerId() {
            const html = this.vNodeHtml;

            return {
                data: () => ({}),
                template: `<div>${html}</div>`,
                components: {
                    MsgPopover,
                },
            };
        },
        async gotoNearComment(direction) {
            // a = ['a','b','c','d','e','f','g','h','i','j','k']
            // curr = a[4] = 'e';

            let searchCommentArr, nearCommentIndex, nearCommentIsNotFound;
            switch (direction) {
                case 'pre': {
                    // 找前半段的  a_pre = ['a','b','c','d']  从后往前找 d -> c -> b ...
                    searchCommentArr = this.commentAll.slice(0, this.listIndex);
                    nearCommentIndex = _.findLastIndex(
                        searchCommentArr,
                        c => c && c.type.includes(COMMENT_TYPE_HEADER),
                    );
                    nearCommentIsNotFound = nearCommentIndex === -1;
                    break;
                }
                case 'next': {
                    // 找后半段的  a_next = ['f','g','h','i','j','k']  从前往后找 f -> g -> h ...
                    const index = this.listIndex + 1;
                    searchCommentArr = this.commentAll.slice(index);
                    nearCommentIndex = _.findIndex(searchCommentArr, c => c && c.type.includes(COMMENT_TYPE_HEADER));
                    nearCommentIsNotFound = nearCommentIndex === -1;
                    nearCommentIndex += index;
                    break;
                }
                default:
                    throw new Error('gotoNearComment unknown direction');
            }

            if (nearCommentIsNotFound) {
                Message.warning('这是第一条评论,上面已经没有啦');
            } else {
                const preMsg = this.msgAll[nearCommentIndex];

                // 是否有筛选
                const msgIsFilter = this.$store.getters['query/search/msgIsFilter'];
                if (!msgIsFilter) {
                    await this.$store.dispatch('goToMsg', { id: preMsg.id });
                    return;
                }
                // 有筛选并且在筛选内
                const msgShow = this.$store.getters.msgShow;
                const inMsgFilter = msgShow.some(m => m.id === preMsg.id);
                if (inMsgFilter) {
                    await this.$store.dispatch('goToMsg', { id: preMsg.id });
                    return;
                }
                // 有筛选不在筛选内
                try {
                    await this.$confirm(
                        `找到了上一条评论 ${TMPL_HTML_COMMENT_INNER_LINK(
                            preMsg.id,
                        )}<br/>但已被当前筛选条件过滤，无法显示。<br/>是否清除筛选？`,
                        '提示',
                        {
                            confirmButtonText: '清除',
                            cancelButtonText: '取消',
                            type: 'warning',
                            dangerouslyUseHTMLString: true,
                            closeOnClickModal: false,
                        },
                    );
                    await this.$store.dispatch('query/search/sendSearch', { search: {}, id: preMsg.id });
                } catch (error) {
                    Message.info('已取消' + (error.message || ''));
                }
            }
        },
        async preComment() {
            await this.gotoNearComment('pre');
        },
        async nextComment() {
            await this.gotoNearComment('next');
        },
        logComment() {
            console.log(this.comment);
        },
    },
    components: {
        MsgPopover,
    },
};
</script>
<style lang="sass" scoped>
@import '~@/styles/vars.module.sass'
@import './commentCommon.sass'

// 让评论和消息对齐
@mixin commentTopMargin
    margin-top: 21px // 这个高度对应每条消息 timeLine 的高度, 目的是让消息和评论的上沿对齐

.commentWrap
    height: 100%
    box-sizing: border-box
    padding-left: 16px
    font-size: 14px
    border-radius: 6px
    position: relative
    &.paddingYear
        padding-top: calc( 24px + 25px ) !important
    .comment
        transition: all 0.3s
        filter: drop-shadow( 0 1px 2px rgba(0, 0, 0, .12))
        display: flex
        flex-direction: column
        height: 100%
        box-sizing: border-box
        &:hover
            filter: drop-shadow( 0 2px 12px rgba(0, 0, 0, 0.1))
            .header,.footer
                .line
                    display: block
        .header,.footer
            .line
                position: absolute
                right: 0
                border-top: 2px dashed rgba(0, 0, 0, 0.3)
                width: 100vh
                display: none
        .header
            font-size: 12px
            line-height: 12px
            height: 12px
            padding: 5px
            background: #F6F8FA
            position: relative
            border: 1px solid #E1E4E8
            @include commentTopMargin
            &::after, &::before
                position: absolute
                top: 11px
                right: 100%
                left: -16px
                width: 0
                height: 0
                pointer-events: none
                content: " "
                border-color: transparent
                border-style: solid solid outset
                display: block
            &::after
                margin-top: 1px
                margin-left: 2px
                border-width: 7px
                border-right-color: #F6F8FA
            &::before
                border-width: 8px
                border-right-color: #E1E4E8
            .line
                top: 0
            .actions
                float: right
                i
                    margin-left: 2px
                    cursor: pointer
        .content
            // 评论内容的 css 不要单独写在这里, 要写到 $commentContent 里面去， 因为 增加评论|修改评论|查看评论 共用
            @include commentContent
        .doublyLink
            background: rgb(246, 248, 250)
            text-align: center
            padding: 5px 0
            font-size: 12px
            border-top: 1px dashed #d0d7de
            border-left: 1px solid #E1E4E8
            border-right: 1px solid #E1E4E8
            &.onlyLink
                @include commentTopMargin
            @include commentLink
        .footer
            border-bottom: 1px solid #E1E4E8
            position: relative
            margin-bottom: $msgRow_margin_bottom
            .line
                top: 0
.dialog-comment-detail
    .content
        @include commentContent
</style>
