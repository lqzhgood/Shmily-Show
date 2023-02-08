<template>
	<MsgWrap>
		<CAudio :length="time" :src="src" :stt="sttText" />
	</MsgWrap>
</template>

<script>
import CAudio from '@/components/Msg/components/Type/Audio';

export default {
	name: 'Msg-MobileQQ-Android-audio',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		data() {
			return this.msg.$MobileQQ.data;
		},
		src() {
			return this.data.mp3Url;
		},
		time() {
			return this.data.time;
		},
		sttText() {
			return this.data.sttText;
		},
	},
	components: {
		CAudio,
	},
};
</script>
<style lang="sass" scoped>
</style>