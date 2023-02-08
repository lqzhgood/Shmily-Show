<template>
	<MsgWrap noPadding>
		<div :class="paySubtype.class" class="wechat-pay">
			<div class="title">
				<img :src="iconSrc" class="img" data-is-icon />
				<h4 class="text">
					<span>{{text}}</span>
					<br />
					<span class="tip">{{paySubtype.text}} {{tip}}</span>
				</h4>
			</div>
			<div class="bottom">微信转账</div>
		</div>
	</MsgWrap>
</template>
<script>
import _ from 'lodash';

export default {
	name: 'Msg-Wechat-pay',
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
			return _.get(item, 'content.msg.appmsg.wcpayinfo.feedesc');
		},
		tip() {
			const item = this.item;
			return _.get(item, 'content.msg.appmsg.title') || '微信转账';
		},
		iconSrc() {
			switch (this.paySubtype.class) {
				case 'collect':
					return '/static/msg/source/Wechat/img/transfer_ok.png';

				default:
					return '/static/msg/source/Wechat/img/transfer.png';
			}
		},
		paySubtype() {
			const item = this.item;
			const type = _.get(item, 'content.msg.appmsg.wcpayinfo.paysubtype') + '';
			switch (type) {
				case '1':
					return {
						class: 'pay',
						text: '已转账',
					};
				case '3':
					return {
						class: 'collect',
						text: '已收钱',
					};
				default:
					console.warn(`paysubtype ${type}`);
					return {
						class: '',
						text: '',
					};
			}
		},
	},
};
</script>
<style lang="sass" scoped>
.wechat-pay
    width: 240px
    background-color: #fff
    .title
        background-color: rgba(252,157,43,1)
        border-radius: 2px 2px 0px 0px
        padding: 10px
        display: flex
        .img
            flex: 0 0 auto
            width: 40px
            height: 40px
            vertical-align: top
            margin-top: 3px
            margin-right: 10px
        .text
            flex: 1 1 auto
            margin: 0
            padding: 0
            color: #fff
            max-width: 180px
            min-height: 50px
            font-weight: 500
            word-wrap: break-word
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            .tip
                font-size: 12px
                color: rgba(255, 255, 255, 0.8)
    .bottom
        line-height: 22px
        text-indent: 10px
        font-size: 12px
        color: #999
    &.collect
        .title
            background-color: rgba(252,157,43,0.5)
</style>