<template>
    <div class="addComment">
        <i
            :class="{ active: commentSId === msg.id }"
            :title="commentSId"
            @click="addStart()"
            class="btn el-icon-circle-plus-outline"
        ></i>
        <i
            :class="{ active: commentEId === msg.id }"
            :title="commentEId"
            @click="addEnd()"
            class="btn el-icon-remove-outline"
        ></i>
        <i :class="{ active: commentHtml.trim() }" @click="selectComment()" class="btn el-icon-s-promotion"></i>

        <el-dialog :visible.sync="showDialogHtmlEdit" width="30%" class="dev-dialog-comment">
            <div slot="title">
                <span>新增评论</span>
                <Actions :commentSId="commentSId" />
            </div>
            <CommentHtmlInput
                :commentSId="commentSId"
                :show="showDialogHtmlEdit"
                :subFn="addComment"
                :text.sync="commentHtml"
            />
            <div class="content" v-html="commentHtml"></div>
            <span class="dialog-footer" slot="footer">
                <el-button :loading="loading" @click="showDialogHtmlEdit = false">取 消</el-button>
                <el-button :loading="loading" @click="addComment()" type="primary">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import CommentHtmlInput from './components/CommentHtmlInput';
import Actions from './components/Actions';

export default {
    props: {
        msg: Object,
    },
    data: () => ({
        loading: false,
        showDialogHtmlEdit: false,
    }),
    computed: {
        ...mapState('dev/', ['commentSMsg', 'commentEMsg']),
        commentSId() {
            return this.commentSMsg ? this.commentSMsg.id : '';
        },
        commentEId() {
            return this.commentEMsg ? this.commentEMsg.id : '';
        },
        commentHtml: {
            get() {
                return this.$store.state.dev.commentHtml;
            },
            set(v) {
                this.$store.commit('dev/setCommentHtml', v);
            },
        },
    },
    methods: {
        selectComment() {
            if (!this.commentSId || this.commentSMsg.index > this.msg.index) this.addStart();
            if (!this.commentEId || this.commentSMsg.index < this.msg.index) this.addEnd();
            this.showDialogHtmlEdit = true;
        },
        addStart() {
            this.$store.commit('dev/setCommentSMsg', this.msg);
        },
        addEnd() {
            this.$store.commit('dev/setCommentEMsg', this.msg);
        },
        addComment() {
            if (this.loading) return;
            this.loading = true;
            this.$store
                .dispatch('dev/addComment')
                .then(() => {
                    this.showDialogHtmlEdit = false;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    components: {
        CommentHtmlInput,
        Actions,
    },
};
</script>
<style lang="sass" scoped>
@import '../../Comment/commentCommon.sass'
@import './style.sass'

.addComment
    position: absolute
    top: 0
    right: 20px
    ::v-deep .el-dialog
        min-width: 600px
    .content
        @include commentContent
    .btn
        cursor: pointer
        border-radius: 50%
        &.active
            background: red
            color: #fff

.dev-dialog-comment
    @include dev-comment-dialog
</style>
