<template>
	<div>
		<div class="box" v-if="currTypes.length !==0">
			<el-form class="form" label-position="top">
				<!-- <el-form-item label="开关">
					<el-switch active-text="替换" inactive-text="追加" v-model="value1"></el-switch>
				</el-form-item>-->
				<el-form-item label="类型">
					<el-radio-group :disabled="Object.keys(tmpUpData).length!==0" v-model="upData.type">
						<el-radio :key="t.type" :label="t.type" v-for="t in currTypes">{{t.type}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="复制文件路径">
					<el-input class="input" placeholder="如果填写将从路径 [复制] 文件" v-model.trim="upData.filePath"></el-input>
				</el-form-item>
				<el-form-item label="表情说明" v-if="showFaceForm">
					<el-input class="input" v-model.trim="unknownFace.type">
						<template slot="prepend">表情包名称</template>
						<el-button @click="showDialogFace=true" icon="el-icon-search" slot="append"></el-button>
					</el-input>
					<el-input class="input" v-model.trim="unknownFace.alt">
						<template slot="prepend">表情说明</template>
						<el-button @click="addFace()" plain slot="append" style="float:right" type="primary">提交</el-button>
					</el-input>
				</el-form-item>
			</el-form>
			<div :class="{'disabled':!canUp}" class="up" v-if="!upFileImgPreSrc">
				<el-upload
					:accept="upData.type === '表情'? 'image/*': ''"
					:data="updDataMerge"
					:disabled="!canUp"
					:http-request="postUpFile"
					:limit="1"
					action="#"
					drag
					ref="fileUpload"
				>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">
						将文件拖到此处，或
						<em>点击上传</em>
					</div>
					<div class="el-upload__tip" slot="tip"></div>
				</el-upload>
			</div>
			<div class="pre" v-else>
				<el-image :src="upFileImgPreSrc"></el-image>
				<el-divider>alias</el-divider>
				<el-upload :auto-upload="false" accept="image/*" action="#" list-type="picture-card" ref="faceAliasUpload">
					<i class="el-icon-plus"></i>
				</el-upload>
			</div>
		</div>
		<el-card v-else>
			<div>
				<span>
					当前
					<el-link type="primary">{{msg.source}}</el-link>文件规则还没写呢，先手动修改 HTML 吧。
				</span>
				<i
					@click="$emit('update:updateByFileShow',false)"
					class="el-icon-circle-close"
					style="float:right;cursor: pointer;color:red"
				></i>
			</div>
		</el-card>

		<template v-if="showDialogFace">
			<DialogFace
				:show.sync="showDialogFace"
				:source="upData.source"
				:type="upData.type"
				@selectFaceType="v=> unknownFace.type = v"
			>
				<el-image :src="upFileImgPreSrc"></el-image>
				<pre>{{JSON.stringify(this.tmpUpData.fileInfo,null,4)}}</pre>
			</DialogFace>
		</template>
	</div>
</template>
<script>
import { Message } from 'element-ui';
import axiosServer from '@/plugins/axios-server';
import _ from 'lodash';

export default {
	props: {
		msg: Object,
	},
	mounted() {
		this.upData.source = this.msg.source;
	},
	data: () => ({
		types: [
			{ source: 'QQ', type: '图片' },
			{ source: 'QQ', type: '视频' },
			{ source: 'QQ', type: '语音' },
			{ source: 'QQ', type: '表情' },
			{ source: 'Wechat', type: '表情' },
		],
		upData: {
			source: '',
			type: '表情', // DEL
			filePath: localStorage.getItem('dev:upData.filePath') || '',
		},
		showFaceForm: false,
		showDialogFace: false,
		upFileImgPreSrc: '',
		unknownFace: {
			type: '',
			alt: '',
		},
		tmpUpData: {},
	}),
	computed: {
		updDataMerge() {
			return Object.assign(this.upData, { msg: this.msg });
		},
		canUp() {
			return this.upData.type;
		},
		currTypes() {
			return this.types.filter(v => v.source === this.msg.source);
		},
	},
	watch: {
		imgAliasList: {
			deep: true,
			handler(v) {
				console.log('v', v);
			},
		},
		'upData.filePath'(v) {
			localStorage.setItem('dev:upData.filePath', v);
		},
	},
	methods: {
		async postUpFile({ data, file: inputFile }) {
			const { source, type, msg } = data;
			const S_T = `${source}_${type}`;

			switch (S_T) {
				case 'QQ_表情':
					{
						const findFaceRes = await this.checkFaceHas(inputFile, data);

						if (findFaceRes.face) {
							// 如果找到表情了，则直接修改 html 和 content
							this.sendMsgText({ msg: findFaceRes.msg, autoSubmit: findFaceRes.accurateFix });
						} else {
							// 没找到的话让用户填(选)表情的种类和alt
							this.showFaceForm = true;
							this.showDialogFace = true;
							await this.$nextTick();
							const src = await this.fileToImg(inputFile);
							this.upFileImgPreSrc = src;

							// 等待用户输入表情 alt 的时候写入临时数据
							this.tmpUpData.sendData = data;
							this.tmpUpData.inputFile = inputFile;
							this.tmpUpData.fileInfo = findFaceRes.fileInfo;

							// 根据 MSG 自动填写 ALt
							this.unknownFace.alt = /^\[(.+)\]$/.test(msg.content)
								? msg.content
										.trim()
										.match(/^\[(.+)\]$/)[1]
										.trim()
								: '';

							if (this.unknownFace.alt === '图') this.unknownFace.alt = '';
						}
					}
					break;
				default:
					// 默认直接将文件放到相应目录即可
					// 转码等在后端逻辑中处理
					{
						// eslint-disable-next-line
						const { code, result } = await axiosServer.file('/msg/modify/file/add', inputFile, {
							...data,
							lastModified: inputFile.lastModified,
						});
						this.sendMsgText({ msg: result.msg, autoSubmit: result.accurateFix });
					}
					break;
			}
			this.$refs.fileUpload.clearFiles();
		},
		async checkFaceHas(inputFile, sendData) {
			// eslint-disable-next-line
			const { source, type, msg } = sendData;
			// eslint-disable-next-line
			const { code, result } = await axiosServer.file('/msg/modify/file/face/has', inputFile, sendData);
			return result;
		},
		async addFace() {
			if (!this.unknownFace.type || !this.unknownFace.alt) {
				Message.error('表情说明不能为空');
				return;
			}
			const { sendData, inputFile, fileInfo } = this.tmpUpData;

			const data = Object.assign(sendData, {
				fileInfo,
				unknownFace: this.unknownFace,
			});
			// 如果有 alias 写入 alias
			const imgAliasList = this.$refs.faceAliasUpload.uploadFiles;

			if (imgAliasList.length !== 0) {
				const files = imgAliasList.map(v => v.raw);
				const { result: aliasArr } = await axiosServer.files('/msg/modify/file/face/alias/add', files, data);
				if (aliasArr.length !== 0) fileInfo.alias = aliasArr;
				this.$refs.faceAliasUpload.clearFiles();
			}

			const { result } = await axiosServer.file('/msg/modify/file/face/add', inputFile, data);
			this.sendMsgText({ msg: result.msg, autoSubmit: result.accurateFix });
		},
		modifyMsgByContentAndHtml(content, html) {
			const _msg = _.cloneDeep(this.msg);
			_msg.content += content;
			_msg.html += html;
			this.sendMsgText({ msg: _msg });
		},
		sendMsgText({ msg, autoSubmit }) {
			this.$emit('updateMsgText', { msg: JSON.stringify(msg, null, 4), autoSubmit });
		},
		fileToImg(inputFile) {
			return new Promise(resolve => {
				const fr = new FileReader();
				fr.onloadend = function (oFRevent) {
					const src = oFRevent.target.result;
					resolve(src);
				};
				fr.readAsDataURL(inputFile);
			});
		},
	},
	components: {
		DialogFace: () => import('@/components/Dialog/Face/index.vue'),
	},
};
</script>
<style lang="sass" scoped>
.box
    display: flex
    width: 690px
    margin: 0 auto
    justify-items: space-between
    .form,.up,.pre
        flex: 1 1 50%
    .form
        margin-right: 10px
        .input
            // width: 300px
    .up.disabled
        opacity: 0.5
        ::v-deep
            .el-upload-dragger
                cursor: not-allowed
</style>

<style lang="sass">
.upDataPathSuggestClass
    .snippets
        display: flex
        .text
            flex: 1 1 auto
</style>