<template>
	<MsgWrap>
		<CVoip :desc="desc" :type="text" />
	</MsgWrap>
</template>
<script>
import CVoip from '@/components/Msg/components/Type/Voip.vue';

export default {
	name: 'Msg-Wechat-voip',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		item() {
			return this.msg.$Wechat.webData;
		},
		desc() {
			return this.item.$des_voip;
		},
		text() {
			return this.item.$text_voip;
		},
	},
	components: {
		CVoip,
	},
};
</script>
<style lang="sass" scoped>
</style>