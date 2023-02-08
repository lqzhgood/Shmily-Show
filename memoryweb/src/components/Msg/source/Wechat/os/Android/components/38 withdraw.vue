<template>
	<MsgWrap>
		<div class="wechat-withdraw">
			<div class="message-tip" v-html="html"></div>
		</div>
	</MsgWrap>
</template>
<script>
export default {
	name: 'Msg-Wechat-withdraw',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		item() {
			return this.msg.$Wechat.webData;
		},
		html() {
			return this.item.content;
		},
	},
};
</script>
<style lang="sass" scoped>
// 撤回
// !!! 无案例验证
.wechat-withdraw
    text-align: center
    .message-tip
        display: inline-block
        background-color: rgba(0, 0, 0, 0.1)
        border-radius: 2px
        padding: 5px 10px
        line-height: 18px
        font-size: 12px
</style>