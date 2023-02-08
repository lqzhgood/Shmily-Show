<template>
	<MsgWrap noPadding>
		<div @click="dialogVisible=true" class="wechat-chatRecord" target="_blank">
			<h4>{{title}}</h4>
			<div class="description" v-html="des"></div>
			<div class="bottom">聊天记录</div>

			<el-dialog
				:append-to-body="true"
				:fullscreen="true"
				:title="title"
				:visible.sync="dialogVisible"
				class="dialog-chatList"
			>
				<div :key="i" class="chatWrap" v-for="(v,i) in datalist">
					<div class="left">
						<img :src="avatarUrl(v)" class="avatar" />
					</div>
					<div class="center">
						<div class="row">
							<div class="info">
								<span class="name">{{v.sourcename}}</span>
								<span class="time">{{v.sourcetime}}</span>
							</div>
							<img :src="chatUrl(i,v.fullmd5)" @click="previewImg(i,v.fullmd5)" v-if="v.fullmd5" />
							<hr />
						</div>
					</div>
					<div class="right"></div>
				</div>
			</el-dialog>
		</div>
	</MsgWrap>
</template>
<script>
// TODO 只处理了纯图片的形式 更多样式需要 更多样本支持

import _ from 'lodash';
export default {
	name: 'Msg-Wechat-chatRecord',
	props: {
		msg: Object,
	},
	data: () => ({
		dialogVisible: false,
	}),
	computed: {
		item() {
			return this.msg.$Wechat.webData;
		},
		url_pre() {
			return _.get(this.item, '$url_pre');
		},
		title() {
			return _.get(this.item, 'content.msg.appmsg.title');
		},
		des() {
			const des = _.get(this.item, 'content.msg.appmsg.recorditem.recordinfo.desc', '').replace(
				/(\r\n|\r|\n)/g,
				'<br/>',
			);
			return des;
		},
		datalist() {
			return _.get(this.item, 'content.msg.appmsg.recorditem.recordinfo.datalist.dataitem', []) || [];
		},
	},
	methods: {
		avatarUrl(v) {
			const id = _.get(v, 'dataitemsource.fromusr');
			return `${this.url_pre}/avatar/${id}.png`;
		},
		chatUrl(i, fullmd5) {
			const msgId = this.item.msgId;
			// TODO 可能有 png 啥的 这里没处理
			return `${this.url_pre}/chatList/${msgId}/${i}_${fullmd5}.jpg`;
		},
		previewImg(index, fullmd5) {
			const imgList = this.datalist
				.map((v, i) => ({ i, fullmd5: v.fullmd5 }))
				.filter(v => v.fullmd5)
				.map(v => this.chatUrl(v.i, v.fullmd5));
			this.$hevueImgPreview({
				multiple: true, // 开启多图预览模式
				nowImgIndex: imgList.findIndex(v => v == this.chatUrl(index, fullmd5)),
				imgList, // 需要预览的多图数组
			});
		},
	},
};
</script>
<style  lang="sass">
.dialog-chatList
    .chatWrap
        display: flex
        .left
            flex: 0 1 50px
            padding-right: 10px
            box-sizing: border-box
            .avatar
                max-width: 40px
        .right
            flex: 0 1 50px
        .center
            flex: 1 1 auto
            .info
                display: flex
                .name
                    flex: 1 1 auto
                .time
                    flex: 0 1 140px
                    text-align: right
                    font-size: 12px
            img
                max-width: 140px
</style>
<style lang="sass" scoped>
.wechat-chatRecord
    width: 240px
    min-height: 40px
    padding: 10px
    border-radius: 2px
    padding-bottom: 0
    text-decoration: none
    color: #333
    cursor: pointer
    display: inline-block
    background: #fff
    h4
        font-size: 15px
        margin: 0
        font-weight: 500
        padding-bottom: 0
        word-wrap: break-word
    .description
        min-height: 50px
        font-size: 12px
        color: #9c9c9c
        margin: 0
        word-break: break-all
    .bottom
        line-height: 22px
        font-size: 12px
        color: #999
        border-top: 1px solid #e4e4e4
</style>