<template>
	<div>
		<el-divider class="hr">
			<i class="el-icon-paperclip"></i>
		</el-divider>
		<el-divider class="fileNotExist" v-if="!fileParse.base">文件不存在</el-divider>

		<div class="attachment" v-else>
			<div class="pre" v-if="isSpecialExtToPre">
				<img :src="url" v-if="specialExt == 'isPic'  && !matchSrcInElm(msg.html,'img', url) " />
				<video :src="url" controls v-if="specialExt == 'isVideo' && !matchSrcInElm(msg.html,'video', url) "></video>
				<audio :src="url" controls v-if="specialExt == 'isAudio' && !matchSrcInElm(msg.html,'audio', url) "></audio>
				<amr :url="url" v-if="ext === '.amr'" />
			</div>
			<div :class="{'RealFileNotExist': !RealFileExist}" class="content">
				<div class="left">
					<img :src="iconMap(ext)" class="icon" />
				</div>
				<div class="right">
					<div :title="`${fileParse.base} - ${fileParse.size}`" class="name">
						{{ fileParse.base }}
						<span class="size" v-if="fileParse.size">( {{ fileParse.size }} )</span>
					</div>
					<div class="action">
						<a :href="url" download target="_blank">下载</a>
						<a :href="url" target="_blank">打开</a>
						<a @click="openPre(url)" v-if="specialExt == 'isPic'">预览</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { fileExist } from '@/utils/net';
import { EXT_IMAGE, EXT_VIDEO, EXT_AUDIO } from '@/utils/const';

export default {
	name: 'Msg-Components-Common-File-Simple',
	async mounted() {
		if (this.fileParse.base) this.RealFileExist = await fileExist(this.url);
	},
	props: {
		msg: {
			type: Object,
		},
		fileParse: {
			type: Object,
			require: true,
		},
		// 文件名需要被 encodeURIComponent 且应该在生成 msg.json 时就要处理
		url: {
			type: String,
			require: true,
		},
	},
	data: () => ({
		RealFileExist: true,
	}),
	computed: {
		ext() {
			return this.fileParse.ext ? this.fileParse.ext.toLowerCase() : null;
		},
		specialExt() {
			const ext = this.fileParse.ext;
			if (EXT_IMAGE.includes(ext.toLowerCase())) return 'isPic';
			if (EXT_VIDEO.includes(ext.toLowerCase())) return 'isVideo';
			if (EXT_AUDIO.includes(ext.toLowerCase())) return 'isAudio';
			return '';
		},
		isSpecialExtToPre() {
			return !!this.specialExt || this.ext === '.amr';
		},
	},
	methods: {
		iconMap(ext) {
			const defaultIcon = './static/msg/source/QQ/icon/file.png';
			return defaultIcon;
		},
		openPre(url) {
			this.$hevueImgPreview(url);
		},
		matchSrcInElm(html, nodeName, fileUrl) {
			// 如果 html 里面已经有预览的代码了 就不再显示预览
			const nodeReg = new RegExp(`<${nodeName}.*?(?:>|\\/>)`, 'gi'); //匹配图片中的img标签
			const srcReg = /src=['"]?([^'"]*)['"]?/i; // 匹配图片中的src
			const nodeTextArr = html.match(nodeReg) || []; //筛选出所有的img
			return nodeTextArr.some(nodeText => {
				const src = nodeText.match(srcReg).toString() || '';
				return src.includes(fileUrl);
			});
		},
	},
	components: {
		amr: () => import('./fileType/amr.vue'),
	},
};
</script>
<style lang="sass" scoped>
.fileNotExist
    white-space: nowrap
.attachment
    &:last-child
        margin-bottom: 0
    .content
        background: #F2F2F2
        padding: 5px 10px
        display: flex
        font-size: 12px
        line-height: 17px
        text-shadow: 0px 0px 1px #acacac
        margin-bottom: 10px
        &.RealFileNotExist
            .left, .right .name
                opacity: 0.5
            .action
                text-decoration: line-through
        .left
            .icon
                margin: 2px 8px 0 0
                max-width: 32px
                max-height: 32px
        .right
            .name
                .size
                    color: #a0a0a0
                    margin-left: 5px
            .action
                a, a:link, a:visited
                    color: #2C4A77
                    text-decoration: none
                a
                    margin-right: 10px
                    cursor: pointer
                    &:hover
                        text-decoration: underline
                    &:last-child
                        margin-right: 0
</style>