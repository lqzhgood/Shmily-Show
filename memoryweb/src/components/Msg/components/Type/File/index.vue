<template>
	<div :class="{'RealFileNotExist': !RealFileExist}" class="Msg-common-file">
		<div class="top">
			<div class="cover">
				<img :src="fileTypeSrc" class="fileTypeIcon" data-is-icon />
			</div>
			<div class="file-name">
				<div>
					<el-tag :type="type==='send'?'':'success'" class="tag" v-if="humanType">{{humanType}}</el-tag>
					<a :href="url" class="link" target="_blank">
						<span>{{cFileName}}</span>
					</a>
				</div>
				<div class="path">{{path}}</div>
			</div>
		</div>
		<div class="pre" v-if="canPre">
			<el-divider class="hr">
				<i class="el-icon-view"></i>
			</el-divider>
			<img :src="url" loading="lazy" v-if="canPre==='img'" />
			<video :src="url" controls v-if="canPre ==='video'"></video>
			<audio :src="url" controls v-if="canPre ==='audio'"></audio>
		</div>
		<div class="bottom">
			<slot name="appInfo"></slot>
			<span class="fileName">.{{fileExt}} / {{humanSize}}</span>
		</div>
	</div>
</template>
<script>
import filesize from 'filesize';
import { fileExist } from '@/utils/net';
import { EXT_IMAGE, EXT_VIDEO, EXT_AUDIO } from '@/utils/const';

export default {
	name: 'Msg-common-file',
	async mounted() {
		if (!this.url) {
			this.RealFileExist = false;
		} else {
			this.RealFileExist = await fileExist(this.url);
		}
	},
	props: {
		type: {
			type: String,
			validator(v) {
				return ['send', 'receive'].includes(v);
			},
		},
		url: String,
		ext: String,
		fileName: String,
		size: [Number, String],
		path: {
			type: String,
			default: '',
		},
	},
	data: () => ({
		RealFileExist: true,
	}),
	computed: {
		canPre() {
			if (EXT_IMAGE.includes(`.${this.fileExt}`)) return 'img';
			else if (EXT_VIDEO.includes(`.${this.fileExt}`)) return 'video';
			else if (EXT_AUDIO.includes(`.${this.fileExt}`)) return 'audio';
			else return null;
		},
		fileExist() {
			return this.url;
		},
		cFileName() {
			return this.fileName || new URL(this.url).pathname.split('/').pop();
		},
		humanSize() {
			const size = filesize.partial({ base: 2, standard: 'jedec' });
			return !isNaN(this.size) ? size(this.size) : this.size;
		},
		humanType() {
			switch (this.type) {
				case 'send':
					return '发送';
				case 'receive':
					return '接收';
				default:
					return '';
			}
		},
		fileExt() {
			let ext = this.ext || new URL(this.url).pathname.split('.').pop();
			if (ext) {
				ext = ext.replace(/^\./, '').toLowerCase();
			}
			return ext;
		},
		fileTypeSrc() {
			switch (this.fileExt) {
				case 'png':
				case 'jpg':
				case 'jpeg':
				case 'gif':
				case 'webp':
					return require('./assets/icon/img.png');
				case 'mp3':
					return require('./assets/icon/audio.svg');
				case 'mp4':
					return require('./assets/icon/video.svg');
				case 'zip':
				case '7z':
				case 'rar':
					return require('./assets/icon/zip.jpg');
				case 'txt':
					return require('./assets/icon/txt.jpg');
				case 'doc':
				case 'docx':
					return require('./assets/icon/doc.jpg');
				case 'xls':
				case 'xlsx':
					return require('./assets/icon/xls.jpg');
				case 'ppt':
				case 'pptx':
					return require('./assets/icon/ppt.jpg');
				case 'pdf':
					return require('./assets/icon/pdf.jpg');
				case 'apk':
					return require('./assets/icon/apk.svg');
				default:
					return require('./assets/icon/unknown.jpg');
			}
		},
	},
};
</script>
<style lang="sass" scoped>
.Msg-common-file
    width: 280px
    min-height: 40px
    background-color: #fff
    padding: 10px 10px 0 10px
    &.RealFileNotExist
        .file-name
            .link
                text-decoration: line-through !important
    .top
        display: flex
        margin-bottom: 5px
        .cover
            flex: 0 0 50px
            width: 50px
            text-align: center
            .fileTypeIcon
                width: 100%
                object-fit: fill
        .file-name
            margin-left: 10px
            .tag
                margin-right: 10px
            .link
                color: #000
                text-decoration: none
                line-height: 20px
                font-size: 14px
                padding: 0
                font-weight: 500
                max-width: 180px
                word-wrap: break-word
                :hover
                    text-decoration: underline
            .path
                margin-top: 5px
                color: #333
                font-size: 12px
                line-height: 1em
    .pre
        img,video,audio
            max-width: 100%
            min-width: 100%
        .hr
            margin: 12px 0
    .bottom
        border-top: 1px solid #e4e4e4
        font-size: 12px
        color: #9c9c9c
        display: flex
        align-items: center
        .fileName
            flex: 1 1 auto
            text-align: right
</style>