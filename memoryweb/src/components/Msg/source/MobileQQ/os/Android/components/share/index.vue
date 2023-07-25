<template>
    <MsgWrap noPadding>
        <div class="MobileQQ-Android-share" :class="mode">
            <div class="title">
                <a :href="d.url" target="_block">{{ d.title }}</a>
            </div>
            <div class="body">
                <div class="des">
                    <p>{{ d.des }}</p>
                    <p>{{ d.other }}</p>
                </div>
                <div class="cover">
                    <template v-if="Array.isArray(d.coverLink)">
                        <template v-for="(p, i) in d.coverLink">
                            <img
                                v-if="p.isVideo === 0"
                                :src="p.$url || ''"
                                @error.once="$event => ($event.target.src = defaultCoverLink)"
                                data-is-icon
                                :key="i"
                            />
                            <video controls :src="p.$url" v-else :key="i"></video>
                        </template>
                    </template>
                    <img
                        v-else
                        :src="d.coverLink || ''"
                        @error.once="$event => ($event.target.src = defaultCoverLink)"
                        data-is-icon
                    />
                </div>
            </div>
            <div class="appInfo">
                <img
                    :src="d.appIconLocalUrl || ''"
                    @error.once="$event => ($event.target.src = defaultAppIconLocalUrl)"
                    class="appIcon"
                    data-is-icon
                />
                <span class="appName">
                    <a :href="d.appLink" target="_blank">{{ d.appName }}</a>
                </span>
            </div>
        </div>
    </MsgWrap>
</template>
<script>
import {
    MobileQQ_Android_type__分享_2011, // eslint-disable-line no-unused-vars
    MobileQQ_Android_type__分享_5008,
} from '../../types.js';

import { type_5008 } from './5008/index.js';

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
        mode() {
            if (Array.isArray(this.d.coverLink)) {
                return 'album';
            }
            return '';
        },
        data() {
            return this.msg.$MobileQQ.data || {};
            // return this.msg.$MobileQQ.raw.$data.msgData;
        },
        shareType() {
            return this.msg.$MobileQQ.type;
        },
        d() {
            if (this.shareType === MobileQQ_Android_type__分享_5008) {
                return type_5008(this.data);
            } else {
                // MobileQQ_Android_type__分享_2011
                const data = this.data;
                return {
                    url: data.url,
                    title: data.titleValue,
                    des: data.des,
                    other: data.author, //其他信息 如QQ音乐的作者
                    coverLink: data.$coverLocalUrl,
                    appIconLocalUrl: data.$appIconLocalUrl,
                    appLink: data.appLink,
                    appName: data.appName,
                };
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
            > *
                margin-bottom: 2px
            > *:last-child
                margin-bottom: 0px
            img,video
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
.MobileQQ-Android-share.album
    .body
        flex-direction: column
        .cover
            img,video
                width: 100%
                height: auto
</style>
