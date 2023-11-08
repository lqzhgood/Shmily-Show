<template>
    <MsgWrap noPadding>
        <div class="wechat-app">
            <div class="app-top">
                <h4>
                    <a :href="link" class="link" target="_blank">{{ title }}</a>
                </h4>
                <div class="description">
                    <span class="text">
                        <span>{{ des }}</span>
                        <br />
                        <span>收到一个小程序，请在手机上查看</span>
                    </span>
                    <img :src="cover" class="cover" data-is-icon />
                </div>
            </div>
            <div class="app-bottom">
                <img :src="appIcon" class="icon-app" data-is-icon />
                <span class="appName">{{ appName }}</span>
            </div>
        </div>
    </MsgWrap>
</template>
<script>
import _ from 'lodash';

export default {
    name: 'Msg-Wechat-app',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        data() {
            return this.msg.$Wechat.data;
        },
        cover() {
            return _.get(this.data, '$url_cover') || this.appIcon;
        },
        link() {
            return _.get(this.data, '$url_link');
        },
        title() {
            return _.get(this.data, 'appmsg.title');
        },
        des() {
            return _.get(this.data, 'appmsg.des');
        },
        appName() {
            const data = this.data;
            return _.get(data, 'appmsg.sourcedisplayname') || _.get(data, 'appinfo.appname');
        },
        appIcon() {
            return _.get(this.data, 'appinfo.$appicon') || '/static/msg/source/Wechat/img/app.png';
        },
    },
};
</script>
<style lang="sass" scoped>
.wechat-app
    width: 260px
    min-height: 40px
    background-color: #ffffff
    border-radius: 2px
    padding-bottom: 0
    text-decoration: none
    color: #333
    display: inline-block
    padding: 0
    .app-top
        padding: 5px 10px 0 10px
        h4
            font-size: 15px
            margin: 0
            padding: 5px 0px
            font-weight: 500
            padding-bottom: 0
            word-wrap: break-word
            a
                color: #333
                text-decoration: none
                &:hover
                    text-decoration: underline
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
                line-height: 1.5em
            .cover
                flex: 0 0 auto
                width: 40px !important
                height: 40px !important
                margin-top: 4px
                margin-left: 10px
    .app-bottom
        line-height: 22px
        font-size: 12px
        color: #999
        border-top: 1px solid #e4e4e4
        padding: 0 10px
        .icon-app
            max-width: 16px !important
            vertical-align: middle !important
            margin-right: 10px
        .appName
            vertical-align: middle
</style>
