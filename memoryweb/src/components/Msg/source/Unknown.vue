<template>
	<MsgWrap>
		<div class="source-Unknown" v-html="msg.html"></div>
		{{msg}}
	</MsgWrap>
</template>
<script>
import { CONSOLE_STYLE } from '@/utils/const.js';

export default {
	name: 'Msg-Source-Unknown',
	mounted() {
		CONSOLE_STYLE.danger('未知的消息类型', this.msg);
	},
	props: {
		msg: {
			type: Object,
			require: true,
		},
	},
	data: () => ({}),
};
</script>
<style lang="sass" scoped>
</style>
