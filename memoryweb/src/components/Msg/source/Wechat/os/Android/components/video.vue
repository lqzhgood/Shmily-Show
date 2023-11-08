<template>
    <MsgWrap noPadding>
        <video :poster="thumbnail" :src="src || 'srcIsNull'" class="message-video" controls width="100%"></video>
        <div class="length" v-if="!src">时长 {{ time }}s</div>
    </MsgWrap>
</template>
<script>
import _ from 'lodash';
export default {
    name: 'Msg-Wechat-video',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        data() {
            return this.msg.$Wechat.data;
        },
        $mp4info() {
            return this.data.$mp4info || {};
        },
        src() {
            return _.get(this.$mp4info, 'mp4Url');
        },
        thumbnail() {
            return _.get(this.$mp4info, 'thumbnail');
        },
        time() {
            return _.get(this.$mp4info, 'time');
        },
    },
};
</script>
<style lang="sass" scoped>
.length
    text-align: center
</style>
