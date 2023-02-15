<template>
    <MsgWrap>
        <div>{{ location }}</div>
    </MsgWrap>
</template>
<script>
import _ from 'lodash';

export default {
    name: 'Msg-Wechat-share-location',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        data() {
            return this.msg.$Wechat.data;
        },
        location() {
            return _.get(this.data, 'appmsg.title');
        },
    },
};
</script>
<style lang="sass" scoped></style>
