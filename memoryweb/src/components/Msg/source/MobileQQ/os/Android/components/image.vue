<template>
	<MsgWrap noPadding>
		<CImage :src="src" />
	</MsgWrap>
</template>
<script>
import CImage from '@/components/Msg/components/Type/Image/index.vue';

export default {
	name: 'Msg-MobileQQ-Android-image',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		src() {
			return this.msg.$MobileQQ.data.imgUrl;
		},
	},
	components: {
		CImage,
	},
};
</script>
<style lang="sass" scoped>
</style>