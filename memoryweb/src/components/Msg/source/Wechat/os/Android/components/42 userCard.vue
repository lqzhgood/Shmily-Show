<template>
	<MsgWrap noPadding>
		<div class="user-card">
			<div class="user-card-title">
				<img :src="icon" class="user-card-img left" data-is-icon />
				<div class="user-card-text">
					<h4>
						<p>{{name}}</p>
						<p class="info">{{info}}</p>
						<pre :title="sign" class="user-card-sign">{{sign}}</pre>
					</h4>
				</div>
			</div>
			<div class="user-card-bottom">
				<span>{{province}} {{city}}</span>
				<span :title="username" class="user-card-id">{{id}}</span>
			</div>
		</div>
	</MsgWrap>
</template>
<script>
import _ from 'lodash';

export default {
	name: 'Msg-Wechat-userCard',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		item() {
			return this.msg.$Wechat.webData;
		},
		icon() {
			return _.get(this.item, '$url_cover') || '/static/msg/source/Wechat/img/person.jpg';
		},
		name() {
			const item = this.item;
			return _.get(item, 'content.msg.nickname');
		},
		info() {
			const item = this.item;
			return _.get(item, 'content.msg.certinfo');
		},
		sign() {
			const item = this.item;
			return _.get(item, 'content.msg.sign');
		},
		id() {
			const item = this.item;
			return _.get(item, 'content.msg.alias');
		},
		username() {
			const item = this.item;
			return _.get(item, 'content.msg.username');
		},
		province() {
			const item = this.item;
			return _.get(item, 'content.msg.province');
		},
		city() {
			const item = this.item;
			return _.get(item, 'content.msg.city');
		},
	},
};
</script>
<style lang="sass" scoped>
.user-card
    width: 240px
    background-color: #fff
    display: inline-block

    &-title
        border-radius: 2px 2px 0px 0px
        padding: 10px 10px 0px 10px
        display: flex

    &-img
        width: 40px
        height: 40px
        flex: 0 0 auto

    &-text
        margin-left: 10px
        flex: 1 1 auto

    &-text h4
        line-height: 20px
        font-size: 15px
        margin: 0
        padding: 0
        color: #333
        max-width: 180px
        min-height: 50px
        font-weight: 500
        word-wrap: break-word
        p
            margin: 0
        .info
            font-size: 12px
        pre
            margin: 5px 0

    &-sign
        white-space: break-spaces
        font-size: 12px
        color: #999

    &-bottom
        line-height: 22px
        padding: 0 10px
        font-size: 12px
        color: #999
        border-top: 1px solid #e4e4e4
        .user-card-id
            float: right
</style>