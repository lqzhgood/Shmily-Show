<template>
	<div>
		<Snippets :snippets="snippets">
			<el-tag
				:key="v"
				@click="addTag(`<tag>${v}</tag>`)"
				class="tag"
				effect="plain"
				type="success"
				v-for="v in COMMENT_TAGS"
			>{{v}}</el-tag>
		</Snippets>

		<Input
			@keydown.ctrl.enter.native.prevent="subFn && subFn()"
			@keyup.ctrl.native.stop.prevent="ShortcutKeyElm($event)"
			clearable
			placeholder="请输入html"
			ref="input"
			v-model="textInner"
		/>
	</div>
</template>
<script>
import { Message } from 'element-ui';

import { COMMENT_TAGS } from '@/config';
import axiosServer from '@/plugins/axios-server';

import HtmlInputMix from '@/components/Dev/Common/components/HtmlInput/mix';
import { copyText } from '@/utils/index.js';

import Rule_Comment from './rules/comment.js';

export default {
	mixins: [HtmlInputMix],
	props: {
		commentSId: String,
		subFn: Function,
	},
	data: () => ({
		COMMENT_TAGS,
	}),
	computed: {
		textDefault() {
			return `<p>${this.replaceKey}</p>`;
		},
		snippets() {
			const _this = this;
			const sId = this.commentSId;
			const k = this.replaceKey;

			return Rule_Comment(_this, sId, k);
		},
	},
	methods: {
		addTag(t) {
			if (this.textInner.includes(t)) {
				this.textInner = this.textInner.replace(t, '');
			} else {
				this.insertSnippet(t, 0);
			}
		},
		/**
		 * @name:
		 * @description: 输入框键盘快捷键
		 * @param {*} event
		 * @return {*}
		 */
		async ShortcutKeyElm($event) {
			const { key: _key } = $event;
			const key = _key.toLowerCase();

			const s = this.snippets.find(_s => _s.key === key);
			if (s) {
				await s.fn();
				return;
			}
			if (['i', 'b', 'p'].includes(key)) {
				this.insertSnippet(this.simpleElm(key));
			}
		},
		async getFiles() {
			const sId = this.commentSId;
			let files = [];
			try {
				const { result } = await axiosServer.get(`/comment/getFolderFiles?id=${sId}`);
				files = result;
				if (files.length === 0) await axiosServer.get(`/comment/createFolder?id=${sId}`);
			} catch (error) {
				console.log('axios /comment/getFolderFiles error', error.message);
			}
			return files;
		},
		insertComment(str, full, position) {
			if (this.textInner === this.textDefault || this.textInner.trim() === '') {
				this.textInner = full || `<p>${str}</p>`;
			} else {
				this.insertSnippet(str, position);
			}
		},
		msgBoxListVNode(files) {
            // https://github.com/ElemeFE/element/issues/8931
			return (
				<div>
					{files.map(f => (
						<el-link
							icon="el-icon-document-copy"
							style="font-size:12px;display:block"
							nativeOnClick={() =>
								// 不知道如何拿到 messageBox 实例 修改 inputValue
								// 用复制粘贴替代
								copyText(f, Message.success, Message.error)
							}
						>
							{f.replace(/(?<=.{8})(.+)(?=.{8})/, ' ...... ')}
						</el-link> // 有些文件名太长了 所以只显示文件的前8 后8 字符 中间用 ... 显示
					))}
				</div>
			);
		},
	},
};
</script>
<style lang="sass" scoped>
</style>
