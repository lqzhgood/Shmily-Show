<template>
    <div class="ModifyComment">
        <i @click="showDialogHtmlEdit = true" class="btn el-icon-edit"></i>

        <el-dialog :visible.sync="showDialogHtmlEdit" width="30%" class="dev-dialog-comment">
            <div slot="title">
                <span>修改评论</span>
                <Actions :commentSId="msg.id" />
            </div>
            <CommentHtmlInput
                :commentSId="msg.id"
                :show="showDialogHtmlEdit"
                :subFn="ModifyComment"
                :text.sync="newHtml"
            />
            <div class="content" v-html="newHtml"></div>
            <div class="dialog-footer" slot="footer">
                <el-button :loading="loading" @click="DeleteComment()" style="float: left" type="danger">
                    删除
                </el-button>
                <el-button :loading="loading" @click="showDialogHtmlEdit = false">取 消</el-button>
                <el-button :loading="loading" @click="ModifyComment()" type="primary">修改</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import CommentHtmlInput from './components/CommentHtmlInput';
import Actions from './components/Actions';

export default {
    mounted() {
        this.newHtml = this.comment.html || '';
    },
    props: {
        comment: Object,
        msg: Object,
    },
    data: () => ({
        loading: false,
        showDialogHtmlEdit: false,
        newHtml: '',
    }),
    computed: {
        type() {
            return this.comment.type;
        },
    },
    methods: {
        ModifyComment() {
            if (this.loading) return;
            this.loading = true;
            this.$store
                .dispatch('dev/ModifyComment', { msg: this.msg, comment: this.comment, newHtml: this.newHtml })
                .then(() => {
                    this.showDialogHtmlEdit = false;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        DeleteComment() {
            if (this.loading) return;
            this.loading = true;
            this.$store
                .dispatch('dev/DeleteComment', { msg: this.msg, comment: this.comment })
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

.ModifyComment
    position: absolute
    bottom: 0
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
