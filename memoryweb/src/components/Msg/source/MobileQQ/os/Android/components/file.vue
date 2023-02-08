<template>
	<MsgWrap noPadding>
		<File :ext="ext" :fileName="fileName" :path="path" :size="size" :type="type" :url="url"></File>
	</MsgWrap>
</template>
<script>
import File from '@/components/Msg/components/Type/File/index.vue';

import _ from 'lodash';
export default {
	name: 'Msg-MobileQQ-Android-file',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		data() {
			return _.get(this.msg, '$MobileQQ.data', {});
		},
		type() {
			return this.data.type;
		},
		url() {
			return this.data.fileParse.url;
		},
		path() {
			return this.data.fileParse.p;
		},
		ext() {
			return this.data.fileParse.ext;
		},
		fileName() {
			return this.data.fileParse.base;
		},
		size() {
			return this.data.fileParse.size;
		},
	},
	components: {
		File,
	},
};
</script>
<style lang="sass" scoped>
</style>