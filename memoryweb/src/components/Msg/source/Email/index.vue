<template>
	<MsgWrap class="source-Email">
		<div class="content" v-html="msg.html"></div>
		<el-divider class="hr" v-if="attachments.length !== 0">
			<i class="el-icon-paperclip"></i>
		</el-divider>

		<div class="attachments" v-if="attachments && attachments.length > 0">
			<div
				:class="{ isPic: isPic(v.ext), RealFileNotExist:!attachmentsIsRealFileExist[i]}"
				:key="i"
				class="attachment"
				v-for="(v, i) in attachments"
			>
				<div class="left">
					<img :src="v.url" v-if="isPic(v.ext)" />
					<img :src="iconMap(v.ext)" class="icon" v-else />
				</div>
				<div class="right">
					<div class="name">
						{{ v.name }}
						<span class="size">( {{ v.size }} )</span>
					</div>
					<div class="action">
						<a :href="v.url" download target="_blank">下载</a>
						<a @click="previewImg(v.url)" v-if="isPic(v.ext)">预览</a>
						<a download href="./tools/flashplayer_sa.exe" target="_blank" v-if="v.ext.toLowerCase() == '.swf'">下载Flash播放器</a>
					</div>
				</div>
			</div>
		</div>
	</MsgWrap>
</template>
<script>
import { EXT_IMAGE } from '@/utils/const';
import { fileExist } from '@/utils/net';

export default {
	name: 'Source-Email',
	props: {
		msg: Object,
	},
	async mounted() {
		// Email 的附件都是嵌入 body 主体的，所以理论上邮件在，附件在。这个检查没啥必要
		for (let i = 0; i < this.attachments.length; i++) {
			const v = await fileExist(this.attachments[i].url);
			this.$set(this.attachmentsIsRealFileExist, i, v);
		}
	},
	data: () => ({
		attachmentsIsRealFileExist: [],
	}),
	computed: {
		attachments() {
			return this.msg.$Email.attachments;
		},
	},
	methods: {
		iconMap(ext) {
			const root = '/static/msg/source/Email/icon';
			switch (ext.toLowerCase()) {
				case '.mp4':
				case '.m4a':
					return `${root}/video.png`;
				case '.rar':
				case '.zip':
				case '.7z':
					return `${root}/zip.png`;
				case '.sis':
				case '.sisx':
					return `${root}/sisx.png`;
				case '.mht':
				case '.html':
					return `${root}/ie.png`;
				default:
					return `${root}/attachment.gif`;
			}
		},
		isPic(ext) {
			return EXT_IMAGE.includes(ext.toLowerCase());
		},
		previewImg(url) {
			const imgList = this.attachments.filter(v => this.isPic(v.ext)).map(v => v.url);
			this.$hevueImgPreview({
				multiple: true, // 开启多图预览模式
				nowImgIndex: imgList.findIndex(u => u == url),
				imgList, // 需要预览的多图数组
			});
		},
		openPre(url) {
			this.$hevueImgPreview(url);
		},
	},
};
</script>
<style lang="sass" scoped>
.source-Email
    min-width: 300px
    .content
        ::v-deep
            .email-title
                margin-top: 0
                border-bottom: 1px dashed #999
    .hr
        margin-bottom: 12px
    .attachments
        background: #F2F2F2
        padding: 5px 10px
        .attachment
            display: flex
            font-size: 12px
            line-height: 17px
            text-shadow: 0px 0px 1px #acacac
            margin-bottom: 10px
            &.isPic
                flex-direction: column
            &:last-child
                margin-bottom: 0
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
            &.RealFileNotExist
                .left, .right .name
                    opacity: 0.5
                .action
                    text-decoration: line-through
</style>
