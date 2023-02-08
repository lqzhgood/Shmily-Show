<template>
	<MsgWrap noPadding>
		<CLocation :content="content" :lat="lat" :lng="lng" :title="title" />
	</MsgWrap>
</template>
<script>
import CLocation from '@/components/Msg/components/Type/Location.vue';

export default {
	name: 'Msg-MobileQQ-Android-location',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		content() {
			return `${this.msg.day} ${this.msg.time}`;
		},
		location() {
			return this.msg.$MobileQQ.data.location;
		},
		title() {
			return this.location.address;
		},
		lat() {
			return this.location.lat;
		},
		lng() {
			return this.location.lng;
		},
	},
	components: {
		CLocation,
	},
};
</script>
<style lang="sass" scoped>
</style>