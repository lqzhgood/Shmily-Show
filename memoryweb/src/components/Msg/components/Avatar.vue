<template>
	<div>
		<img :src="imgSrc" @contextmenu.prevent="onContextmenu" class="avatarImg" />
	</div>
</template>
<script>
import { copyText, openWin } from '@/utils/index';
import { Message } from 'element-ui';
import { makeUrlQueryUrlById, TMPL_HTML_COMMENT_INNER_LINK } from '@/utils/const';

import { AVATAR_IMG } from '@/config.js';

export default {
	name: 'Msg-Components-Avatar',
	props: {
		msg: {
			require: true,
			type: Object,
		},
	},
	data: () => ({}),
	computed: {
		isDev() {
			return this.$store.getters['app/isDev'];
		},
		imgSrc() {
			const msg = this.msg;
			if (AVATAR_IMG) {
				return AVATAR_IMG(msg);
			} else {
				/* eslint-disable no-unused-vars */
				const {
					source,
					device,
					type,

					direction,

					sender,
					senderName,

					receiver,
					receiverName,

					ms,
				} = msg;
				const avatarRoot = `/static/avatar`;
				const qqRoot = `${avatarRoot}/qq/${direction}/`;
				const wechatRoot = `${avatarRoot}/${source}/${direction}/`;
				const smsCallRoot = `${avatarRoot}/CallLog/`;
				const emailCallRoot = `${avatarRoot}/Email/`;
				const defaultRoot = `${avatarRoot}/default/`;

				/* eslint-enable no-unused-vars */

				switch (source) {
					case 'CallLog':
					case 'SMS':
						return smsCallRoot + 'normal.png';
					default:
						return defaultRoot + (direction === 'go' ? 'go.png' : 'come.png');
				}
			}
		},
	},
	methods: {
		onContextmenu(event) {
			const items = [
				{
					label: '查看头像',
					icon: 'el-icon-user',
					divided: true,
					onClick: () => {
						openWin(this.imgSrc);
					},
				},
				{
					label: '复制 ID',
					icon: 'el-icon-copy-document',
					onClick: () => {
						copyText(this.msg.id, Message.success, Message.error);
					},
				},
				{
					label: '复制链接',
					icon: 'el-icon-position',
					divided: true,
					onClick: () => {
						copyText(makeUrlQueryUrlById(this.msg.id), Message.success, Message.error);
					},
				},
				{
					label: 'F12 打印详细',
					onClick: () => {
						console.log(this.msg);
					},
				},
			];
			if (this.isDev) {
				items.push({
					label: '复制 ID 链接',
					onClick: () => {
						copyText(TMPL_HTML_COMMENT_INNER_LINK(this.msg.id), Message.success, Message.error);
					},
				});
			}

			this.$contextmenu({
				items,
				event,
				//x: event.clientX,
				//y: event.clientY,
				customClass: 'custom-class',
				zIndex: 3,
				minWidth: 230,
			});
			return false;
		},
	},
};
</script>
<style lang="sass" scoped>
.avatarImg
    max-width: 40px
    max-height: 40px
</style>
