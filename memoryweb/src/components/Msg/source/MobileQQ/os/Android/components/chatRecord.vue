<template>
    <MsgWrap noPadding>
        <div class="MobileQQ-Android-chatRecord">
            <div class="source">{{ source }}</div>
            <div class="news">
                <div class="text" v-for="(t, i) in news" :key="i" v-html="t.$text"></div>
            </div>
            <div class="summary" @click="dialogVisible = true">{{ summary }}</div>
        </div>

        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            destroy-on-close
            class="MobileQQ-Android-chatRecord-chatList"
        >
            <div slot="title">
                <div>{{ source }}</div>
                <hr />
            </div>
            <div class="news">
                <div :key="i" class="chatWrap" v-for="(t, i) in news">
                    <div class="left">
                        <img src="/static/msg/source/MobieQQ/img/person.jpg" class="avatar" />
                    </div>
                    <div class="center">
                        <div class="row">
                            <div class="info">
                                <span class="name">$name</span>
                                <span class="time">$time</span>
                            </div>
                            <div v-html="t.$text"></div>
                            <hr />
                        </div>
                    </div>
                    <div class="right"></div>
                </div>
            </div>
            <div>数据不足，待开发...</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </MsgWrap>
</template>
<script>
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
        source() {
            return this.data.source;
        },
        news() {
            return this.data.news;
        },
        summary() {
            return this.data.summary;
        },
    },
};
</script>
<style lang="sass">
.MobileQQ-Android-chatRecord-chatList
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
    .source
        font-size: 16px
    .news
        margin: 10px 5px
        font-size: 12px
        color: #9c9c9c
        .text
            line-height: 14px
            margin-bottom: 10px
            &:last-child
                margin-bottom: 0
    .summary
        font-size: 12px
        border-top: 1px solid #e4e4e4
        color: #9c9c9c
        cursor: pointer
        &:hover
            text-decoration: underline
</style>
