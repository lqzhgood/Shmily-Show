<template>
    <MsgWrap class="red-bag" noPadding>
        <div class="red-bag-title">
            <img class="red-bag-img" data-is-icon src="/static/msg/source/Wechat/img/redbag.png" />
            <div class="red-bag-text">
                <h4>
                    <span>{{ text }}</span>
                    <br />
                    <span class="red-bag-tip">领取红包</span>
                </h4>
            </div>
        </div>
        <div class="red-bag-bottom">微信红包</div>
    </MsgWrap>
</template>
<script>
import _ from 'lodash';

export default {
    name: 'Msg-Wechat-hongBao',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        item() {
            return this.msg.$Wechat.webData;
        },
        text() {
            const item = this.item;
            return _.get(item, 'content.msg.appmsg.wcpayinfo.sendertitle');
        },
    },
};
</script>
<style lang="sass" scoped>
.red-bag
    width: 240px
    background-color: #fff
    border-radius: 2px
    .received // 没有收取与否的案例 不知道是哪个状态
        opacity: 0.5
    .red-bag-title
        background-color: #fc9d2b
        border-radius: 2px 2px 0px 0px
        padding: 10px
        display: flex
        .red-bag-img
            width: 40px
            height: 47px
            display: inline-block
            flex: 0 0 auto
        .red-bag-text
            margin-left: 10px
            flex: 1 1 auto
        h4
            font-size: 15px
            margin: 0
            padding: 0
            color: #fff
            max-width: 180px
            min-height: 50px
            font-weight: 500
            overflow: hidden
            text-overflow: ellipsis
        .red-bag-tip
            font-size: 12px
            color: rgba(255, 255, 255, 0.8)
    .red-bag-bottom
        line-height: 22px
        text-indent: 10px
        font-size: 12px
        color: #999
</style>
