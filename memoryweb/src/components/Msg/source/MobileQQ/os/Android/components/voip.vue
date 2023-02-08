<template>
	<MsgWrap>
		<CVoip :desc="desc" :type="type" />
	</MsgWrap>
</template>
<script>
import CVoip from '@/components/Msg/components/Type/Voip.vue';

export default {
	name: 'Msg-MobileQQ-Android-voip',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		data() {
			return this.msg.$MobileQQ.data;
		},
		type() {
			return this.data.type;
		},
		desc() {
			return this.data.desc;
		},
	},
	components: {
		CVoip,
	},
};
</script>
<style lang="sass" scoped>
</style>