<template>
	<MsgWrap class="wechat-system" noPadding>
		<template v-if="typeof item.content === 'string' && item.content.indexOf('SystemMessages_HongbaoIcon.png') > 0">
			<!-- 收红包 -->
			<div class="message-tip hongBao">
				<img class="red-bag-icon" data-is-icon src="/static/msg/source/Wechat/img/redbag.png" />
				<span>{{text}}</span>
				<span class="red-bag-color">红包</span>
			</div>
		</template>
		<template v-else-if="typeof item.content === 'string'">
			<!-- 撤回啥的 -->
			<div class="message-tip">{{item.content}}</div>
		</template>
		<template v-else>
			<div>未知系统消息</div>
			<div v-html="msg.$Wechat.original.content"></div>
		</template>
	</MsgWrap>
</template>
<script>
export default {
	name: 'Msg-Wechat-system',
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
			return item.content.substring(item.content.indexOf('>') + 1, item.content.indexOf('<_wc_custom_link_'));
		},
	},
};
</script>
<style lang="sass" scoped>
.wechat-system
    background-color: #F1F3F4
    .message-tip
        display: inline-block
        background-color: rgba(0, 0, 0, 0.1)
        border-radius: 2px
        padding: 10px
        line-height: 18px
        font-size: 12px
        &.hongBao
            .red-bag-icon
                width: 12px
                height: 14px
                margin-top: 2px
                margin-left: 10px
                vertical-align: top
                display: inline-block
            .red-bag-color
                color: #f5222d
                margin: 0 5px
</style>