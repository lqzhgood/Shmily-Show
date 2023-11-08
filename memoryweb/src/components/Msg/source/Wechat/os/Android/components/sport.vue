<template>
    <MsgWrap noPadding>
        <div class="wechat-sport" target="_blank">
            <h4>{{ title }}</h4>
            <div class="description">
                <span class="text">{{ des }}</span>
                <img class="icon right sport" data-is-icon src="/static/msg/source/Wechat/img/sport.png" />
                <br />
            </div>
            <div class="bottom">{{ cardText }}</div>
        </div>
    </MsgWrap>
</template>
<script>
import _ from 'lodash';

export default {
    name: 'Msg-Wechat-sport',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        data() {
            return this.msg.$Wechat.data;
        },
        title() {
            return _.get(this.data, 'appmsg.title');
        },
        des() {
            return _.get(this.data, 'appmsg.des');
        },
        cardText() {
            return _.get(this.data, 'appinfo.appname');
        },
    },
};
</script>
<style lang="sass" scoped>
.wechat-sport
    width: 240px
    min-height: 40px
    padding: 10px 10px 0 10px
    text-decoration: none
    display: inline-block
    color: #333
    background: #fff
    h4
        font-size: 15px
        margin: 0
        padding: 5px 0px
        font-weight: 500
        padding-bottom: 0
        word-wrap: break-word
    .description
        min-height: 50px
        font-size: 12px
        color: #9c9c9c
        margin: 0
        padding-bottom: 10px
        word-break: break-all
        display: flex
        .text
            flex: 1 1 auto
            display: flex
            align-items: center
        img.icon
            margin-top: 4px
            width: 40px
            height: 40px
            flex: 0 0 auto
    .bottom
        line-height: 22px
        text-indent: 10px
        font-size: 12px
        color: #999
        border-top: 1px solid #e4e4e4
</style>
