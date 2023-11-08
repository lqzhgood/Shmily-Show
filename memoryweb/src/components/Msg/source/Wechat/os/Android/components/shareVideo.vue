<template>
    <MsgWrap noPadding class="Msg-Wechat-shareVideo">
        <video :src="videourl" controls :poster="thumburl"></video>
        <div class="wrap">
            <div class="content">
                <div class="title">
                    <a :href="articleurl" target="_blank">
                        {{ title }}
                    </a>
                </div>
                <div class="duration" v-if="duration">
                    {{ duration }}
                </div>
            </div>
            <WechatMsgFooter :text="sourcedisplayname" />
        </div>
    </MsgWrap>
</template>
<script>
import _ from 'lodash';
import WechatMsgFooter from './components/Footer';
import { formatSecond } from '@/utils/index';

export default {
    name: 'Msg-Wechat-shareVideo',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        data() {
            return this.msg.$Wechat.data;
        },
        sourcedisplayname() {
            return this.data.sourcedisplayname;
        },
        thumburl() {
            return this.data.thumburl;
        },
        title() {
            return this.data.title;
        },
        video() {
            return _.get(this.data, 'video', {});
        },
        articleurl() {
            return this.video.articleurl;
        },
        duration() {
            return this.video.duration ? formatSecond(this.video.duration) : null;
        },
        videourl() {
            return this.video.videourl;
        },
    },
    components: {
        WechatMsgFooter,
    },
};
</script>
<style lang="sass" scoped>
.Msg-Wechat-shareVideo
    background: #fff
    .wrap
        padding: 10px 20px 0
        .content
            display: flex
            .title
                flex: 1
                a
                    color: inherit
                    text-decoration: none
                    &:hover
                        text-decoration: underline
            .duration
                font-size: 12px
                color: #7d7d7d
</style>
