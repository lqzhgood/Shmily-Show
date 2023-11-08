<template>
	<MsgWrap noPadding>
		<CImage :src="src" />
	</MsgWrap>
</template>
<script>
import CImage from '@/components/Msg/components/Type/Image/index.vue';

export default {
	name: 'Msg-Wechat-image',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		data() {
			return this.msg.$Wechat.data;
		},
		src() {
			const data = this.data;
			const src = Array.isArray(data.$imgUrl) ? data.$imgUrl[0] : data.$imgUrl;
			return src;
		},
	},
	components: {
		CImage,
	},
};
</script>
<style lang="sass" scoped>
</style>