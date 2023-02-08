<template>
	<MsgWrap>
		<div>{{location}}</div>
	</MsgWrap>
</template>
<script>
import _ from 'lodash';

export default {
	name: 'Msg-Wechat-share-location',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		item() {
			return this.msg.$Wechat.webData;
		},
		location() {
			return _.get(this.item, 'content.msg.appmsg.title');
		},
	},
};
</script>
<style lang="sass" scoped>
</style>