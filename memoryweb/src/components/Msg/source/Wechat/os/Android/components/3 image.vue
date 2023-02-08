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
		item() {
			return this.msg.$Wechat.webData;
		},
		src() {
			const item = this.item;
			const src = Array.isArray(item.$imgUrl) ? item.$imgUrl[0] : item.$imgUrl;
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