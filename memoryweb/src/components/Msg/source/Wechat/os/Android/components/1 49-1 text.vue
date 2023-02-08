<template>
	<MsgWrap>
		<CText :html="msg.html"></CText>
	</MsgWrap>
</template>
<script>
import CText from '@/components/Msg/components/Type/Text.vue';

export default {
	name: 'Msg-Wechat-text',
	props: {
		msg: Object,
	},
	data: () => ({}),
	components: {
		CText,
	},
};
</script>
<style lang="sass" scoped>
</style>