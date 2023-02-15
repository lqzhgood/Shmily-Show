<template>
    <MsgWrap noPadding>
        <File :ext="ext" :fileName="text" :size="size" :type="null" :url="url_file">
            <template #appInfo>
                <div class="appInfo">
                    <img :src="appIcon" class="icon-app" data-is-icon />
                    <span class="appName">{{ appname }}</span>
                </div>
            </template>
        </File>
    </MsgWrap>
</template>
<script>
import File from '@/components/Msg/components/Type/File/index.vue';

import _ from 'lodash';
export default {
    name: 'Msg-Wechat-file',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        data() {
            return this.msg.$Wechat.data;
        },
        url_file() {
            return _.get(this.data, '$url_file');
        },
        appname() {
            return _.get(this.data, 'appinfo.appname');
        },
        appIcon() {
            return _.get(this.data, 'appinfo.$appicon') || '/static/msg/source/Wechat/img/app.png';
        },
        ext() {
            return _.get(this.data, 'appmsg.appattach.fileext');
        },
        text() {
            return _.get(this.data, 'appmsg.title');
        },
        size() {
            return _.get(this.data, 'appmsg.des') || _.get(this.data, 'appattach.totallen');
        },
    },
    components: {
        File,
    },
};
</script>
<style lang="sass" scoped>
.appInfo
    display: inline-block
    flex: 0 0 auto
    .icon-app
        width: 16px
        height: 16px
        margin-right: 5px
        object-fit: contain
        vertical-align: text-bottom
</style>
