<template>
	<el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialogVisible" title="收集资源" width="80%">
		<div class="body">
			<el-link :href="assetSrc" target="_blank">{{decodeURI(url.pathname)}}</el-link>
			<div class="content">
				<img :src="assetSrc" v-if="EXT_IMAGE.some(ext=>assetSrc.endsWith(ext))" />
				<video :src="assetSrc" v-if="EXT_VIDEO.some(ext=>assetSrc.endsWith(ext))" />
				<audio :src="assetSrc" v-if="EXT_AUDIO.some(ext=>assetSrc.endsWith(ext))" />
			</div>
			<div class="tags">
				<el-tag
					:disable-transitions="false"
					:key="t"
					@click="currTag = t"
					@close="handleClose(t)"
					closable
					effect="plain"
					v-for="t in tags"
				>{{t}}</el-tag>
				<el-input
					@blur="handleInputConfirm"
					@keyup.enter.native="handleInputConfirm"
					class="input-new-tag"
					ref="saveTagInput"
					v-if="inputVisible"
					v-model="inputValue"
				></el-input>
				<el-button @click="showInput" class="button-new-tag" v-else>+ New Dir</el-button>
			</div>
		</div>
		<span class="dialog-footer" slot="footer">
			<el-tag @close="currTag=''" class="currTag" closable effect="dark" type="success" v-if="currTag">{{currTag}}</el-tag>
			<el-button :disabled="!currTag" :loading="loading" @click="ajaxCopy()" type="primary">提交</el-button>
		</span>
	</el-dialog>
</template>
<script>
import { EXT_IMAGE, EXT_VIDEO, EXT_AUDIO } from '@/utils/const';
import axiosServer from '@/plugins/axios-server';

export default {
	mounted() {
		// 本地存储 目录 tags
		try {
			const copyAssetsDir = JSON.parse(localStorage.copyAssetsDir);
			if (!Array.isArray(copyAssetsDir)) throw new Error('copyAssetsDir 不是数组');
			this.tags = copyAssetsDir;
		} catch (error) {
			console.log('copyAssetsDir', error);
		}
	},
	props: {
		assetSrc: {
			type: String,
			require: true,
		},
		msg: Object,
	},
	data: () => ({
		EXT_IMAGE,
		EXT_VIDEO,
		EXT_AUDIO,
		loading: false,
		tags: [],
		currTag: '',
		inputVisible: false,
		inputValue: '',
	}),
	watch: {
		tags(v) {
			localStorage.copyAssetsDir = JSON.stringify(v);
		},
	},
	computed: {
		url() {
			return this.assetSrc ? new URL(this.assetSrc) : {};
		},
		dialogVisible: {
			get() {
				return this.assetSrc == null ? false : true;
			},
			set(v) {
				this.$emit('update:assetSrc', v ? this.assetSrc : null);
			},
		},
	},
	methods: {
		ajaxCopy() {
			if (this.loading) return;
			this.loading = true;
			axiosServer
				.post('/assets/copy', {
					src: decodeURI(this.url.pathname),
					dir: this.currTag,
					msg: this.msg,
				})
				.then(data => {
					if (data.code != 200) throw new Error(data.msg);
					this.$message.success(data.msg);
					this.dialogVisible = false;
				})
				.catch(err => {
					this.$alert(err.message, '错误');
				})
				.finally(() => {
					this.loading = false;
				});
		},
		handleClose(tag) {
			this.tags.splice(this.tags.indexOf(tag), 1);
		},
		showInput() {
			this.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue && !this.tags.includes(inputValue)) {
				this.tags.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = '';
		},
	},
};
</script>
<style lang="sass" scoped>
.body
    .content
        text-align: center
        *
            max-width: 300px
    .tags
        text-align: right
        .el-tag
            cursor: pointer
        .el-tag + .el-tag
            margin-left: 10px
        .button-new-tag
            margin-left: 10px
            height: 32px
            line-height: 30px
            padding-top: 0
            padding-bottom: 0
        .input-new-tag
            width: 90px
            margin-left: 10px
            vertical-align: bottom
.dialog-footer
    .currTag
        margin-right: 20px
</style>