<template>
	<MsgWrap noPadding>
		<div class="wechat-share">
			<h4>
				<a :href="url" target="_blank">{{title}}</a>
			</h4>
			<div class="description">
				<img :src="linkIcon" class="thumb" data-is-icon />
				{{des}}
			</div>
			<div class="bottom">
				<img :src="appIcon" class="icon-app" data-is-icon />
				<span class="appName">{{appName}}</span>
			</div>
		</div>
	</MsgWrap>
</template>
<script>
import _ from 'lodash';

export default {
	name: 'Msg-Wechat-share',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		item() {
			return this.msg.$Wechat.webData;
		},
		url() {
			return _.get(this.item, 'content.msg.appmsg.url');
		},
		title() {
			return _.get(this.item, 'content.msg.appmsg.title');
		},
		des() {
			return _.get(this.item, 'content.msg.appmsg.des');
		},
		appName() {
			return _.get(this.item, 'content.msg.appinfo.appname');
		},
		appIcon() {
			return _.get(this.item, 'content.msg.appinfo.$appicon') || '/static/msg/source/Wechat/img/app.png';
		},
		linkIcon() {
			return _.get(this.item, '$linkIcon') || '/static/msg/source/Wechat/img/link.jpg';
		},
	},
};
</script>
<style lang="sass" scoped>
.wechat-share
    width: 240px
    min-height: 40px
    padding: 10px
    border-radius: 2px
    padding-bottom: 0
    display: inline-block
    background: #fff
    h4
        margin: 0
        padding-top: 5px
        a
            font-weight: 500
            word-wrap: break-word
            color: #333
            font-size: 15px
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
        img.thumb
            max-width: 40px
            max-height: 40px
            display: block
            float: right
            margin-left: 10px
    .bottom
        line-height: 22px
        padding-left: 5px
        font-size: 12px
        color: #999
        border-top: 1px solid #e4e4e4
        .icon-app
            max-width: 16px !important
            vertical-align: middle !important
            margin-right: 10px
        .appName
            vertical-align: middle
</style>