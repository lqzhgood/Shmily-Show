<template>
    <MsgWrap class="source-QQ">
        <div class="content" v-html="msg.html"></div>

        <File :fileParse="fileParse" :msg="msg" :url="url" v-if="haveFile" />
    </MsgWrap>
</template>
<script>
import _ from 'lodash';

export default {
    name: 'Source-QQ-PC',
    props: {
        msg: {
            type: Object,
            require: true,
        },
    },
    data: () => ({}),
    computed: {
        fileParse() {
            return _.get(this.msg, '$QQ.data.fileParse');
        },
        haveFile() {
            return this.fileParse && Object.keys(this.fileParse).length > 0;
        },
        url() {
            // html 中可能也包含 audio 等文件资源
            return this.fileParse.url;
        },
    },
    components: {
        File: () => import('../../components/Type/File-Simple/index.vue'),
    },
};
</script>
<style lang="sass" scoped>
.source-QQ
    // background-color: #ffccc7 // TEST
    .content
        ::v-deep
            img[data-is-face]
                max-width: 100px
                max-height: 100px
    // &.go
    //     .content
    //         color: #8080FF !important
    // &.come
    //     .content
    //         font-weight: bold
    //         color: #FF0000 !important
</style>
