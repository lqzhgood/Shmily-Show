<template>
	<MsgWrap>
		<CAudio :length="VoiceTime" :src="src" />
	</MsgWrap>
</template>

<script>
import _ from 'lodash';

import CAudio from '@/components/Msg/components/Type/Audio';

export default {
	name: 'Msg-Wechat-audio',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		item() {
			return this.msg.$Wechat.webData;
		},
		$mp3Info() {
			return this.item.$mp3Info;
		},
		src() {
			return _.get(this.$mp3Info, 'mp3Url');
		},
		VoiceTime() {
			const t = _.get(this.$mp3Info, 'time') || '-1';
			return t / 1000;
		},
	},
	components: {
		CAudio,
	},
};
</script>
<style lang="sass" scoped>
</style>