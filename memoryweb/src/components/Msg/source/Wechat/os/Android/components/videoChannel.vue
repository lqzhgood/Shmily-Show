<template>
    <MsgWrap noPadding>
        <div class="Msg-Wechat-VideoChannel">
            <a :href="url" target="_blank">
                <img :src="coverUrl" alt="cover" class="cover" data-is-icon />
            </a>

            <div class="content">
                <div class="title">
                    <img :src="avatar" alt="avatar" class="avatar" data-is-icon />
                    <div class="nickname">{{ nickname }}</div>
                    <div class="duration" v-if="videoPlayDuration">{{ videoPlayDuration }}s</div>
                </div>
                <div class="desc">{{ desc }}</div>
                <WechatMsgFooter text="视频号" icon="/static/icon/type/Wechat-视频号.png" />
            </div>
        </div>
    </MsgWrap>
</template>
<script>
import _ from 'lodash';
import WechatMsgFooter from './components/Footer';

export default {
    name: 'Msg-Wechat-VideoChannel',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        data() {
            return this.msg.$Wechat.data;
        },
        avatar() {
            return this.data.avatar || '/static/msg/source/Wechat/img/person.jpg';
        },
        nickname() {
            return this.data.nickname;
        },
        desc() {
            return this.data.desc;
        },
        media() {
            return _.get(this.data, 'media', {});
        },
        coverUrl() {
            return _.get(this.media, 'coverUrl', '/static/msg/source/Wechat/img/video_channel_default_cover.png');
        },
        url() {
            return _.get(this.media, 'url');
        },
        videoPlayDuration() {
            return _.get(this.media, 'videoPlayDuration');
        },
    },
    components: { WechatMsgFooter },
};
</script>
<style lang="sass" scoped>
.Msg-Wechat-VideoChannel
    background: #fff
    max-width: 300px
    .cover
        display: block
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    .content
        padding: 10px 20px 0
        .title
            display: flex
            align-items: center
            margin-bottom: 10px
            .avatar
                margin-right: 10px
                max-width: 25px
                max-height: 25px
                border-radius: 50%
            .nickname
                flex: 1
        .desc
            border-bottom: 1px solid #e6e6e6
            padding-bottom: 15px
</style>
