<template>
	<MsgWrap noPadding>
		<File :ext="ext" :fileName="text" :size="size" :type="null" :url="url_file">
			<template #appInfo>
				<div class="appInfo">
					<img :src="appIcon" class="icon-app" data-is-icon />
					<span class="appName">{{appname}}</span>
				</div>
			</template>
		</File>
	</MsgWrap>
</template>
<script>
import File from '@/components/Msg/components/Type/File/index.vue';

import _ from 'lodash';
export default {
	name: 'Msg-Wechat-file',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		item() {
			return this.msg.$Wechat.webData;
		},
		url_file() {
			return _.get(this.item, '$url_file');
		},
		appname() {
			return _.get(this.item, 'content.msg.appinfo.appname');
		},
		appmsg() {
			return _.get(this.item, 'content.msg.appmsg', {});
		},
		ext() {
			return _.get(this.appmsg, 'appattach.fileext');
		},
		text() {
			return _.get(this.appmsg, 'title');
		},
		size() {
			return _.get(this.appmsg, 'des') || _.get(this.appmsg, 'appattach.totallen');
		},
		appIcon() {
			return _.get(this.item, 'content.msg.appinfo.$appicon') || '/static/msg/source/Wechat/img/app.png';
		},
	},
	components: {
		File,
	},
};
</script>
<style lang="sass" scoped>
.appInfo
    display: inline-block
    flex: 0 0 auto
    .icon-app
        width: 16px
        height: 16px
        margin-right: 5px
        object-fit: contain
        vertical-align: text-bottom
</style>