<template>
	<MsgWrap noPadding>
		<div class="MobileQQ-Android-share">
			<div class="title">
				<a :href="d.url" target="_block">{{d.title}}</a>
			</div>
			<div class="body">
				<div class="des">
					<p>{{d.des}}</p>
					<p>{{d.other}}</p>
				</div>
				<div class="cover">
					<img :src="d.coverLink" @error.once="$event=>$event.target.src=defaultCoverLink" data-is-icon />
				</div>
			</div>
			<div class="appInfo">
				<img
					:src="d.appIconLocalUrl"
					@error.once="$event=>$event.target.src=defaultAppIconLocalUrl"
					class="appIcon"
					data-is-icon
				/>
				<span class="appName">
					<a :href="d.appLink" target="_blank">{{d.appName}}</a>
				</span>
			</div>
		</div>
	</MsgWrap>
</template>
<script>
import { linkAbsolutely } from "@/utils/index.js";


export default {
	name: 'Source-MobileQQ-Android-share',
	props: {
		msg: Object,
	},
	data: () => ({
        defaultCoverLink: require('./icon/link.jpg'),
        defaultAppIconLocalUrl: require('./icon/web.svg'),
    }),
	computed: {
        msgType(){
            return this.msg.$MobileQQ.raw.msgtype;
        },
		data() {
			return this.msg.$MobileQQ.raw.$data.msgData;
		},
        d(){
            switch (Number(this.msgType)) {
                case -5008:
                   {
                    const news = this.data.meta?.news || {};
                     return {
                        url: linkAbsolutely(news.jumpUrl),
                        title: news.title,
                        des: news.desc,
                        other:'',
                        coverLink: linkAbsolutely(news.preview),
                        appIconLocalUrl : news.$iconLocalUrl,
                        appLink: linkAbsolutely(news.source_url),
                        appName : news.tag,
                    };
                   }
                default:
                   {
                     return {
                        url: this.data.url,
                        title:this.data.titleValue,
                        des:this.data.des,
                        other:  this.data.author,//其他信息 如QQ音乐的作者
                        coverLink:this.data.$coverLocalUrl || this.defaultCoverLink,
                        appIconLocalUrl :this.data.$appIconLocalUrl || this.defaultAppIconLocalUrl,
                        appLink:this.data.appLink,
                        appName :  this.data.appName,
                    };
                   }
            }
        },
	},
};
</script>
<style lang="sass" scoped>
.MobileQQ-Android-share
    width: 280px
    background: #fff
    padding: 10px 10px 0px 10px
    a
        color: #000
        text-decoration: none
        &:hover
            text-decoration: underline
    .title
        a
            font-size: 14px
    .body
        font-size: 12px
        color: #333
        display: flex
        .des
            flex: 1 1 auto
            p
                margin: 0
        .cover
            flex: 0 0 50px
            img
                width: 50px
                height: 50px
                object-fit: contain
    .appInfo
        margin-top: 10px
        border-top: 1px solid #e4e4e4
        .appIcon
            width: 16px
            height: 16px
            object-fit: contain
            margin-right: 5px
            vertical-align: middle
        .appName
            vertical-align: middle
            font-size: 12px
</style>