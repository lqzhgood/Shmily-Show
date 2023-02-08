<template>
	<MsgWrap noPadding>
		<video :poster="cover" :src="src" controls width="100%"></video>
	</MsgWrap>
</template>
<script>
export default {
	name: 'Msg-MobileQQ-Android-video',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		src() {
			return this.msg.$MobileQQ.data.videoLocalUrl;
		},
		cover() {
			return this.msg.$MobileQQ.data.videoCoverUrl;
		},
	},
};
</script>
<style lang="sass" scoped>
</style>