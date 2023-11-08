<template>
    <MsgWrap noPadding>
        <CLocation :content="content" :lat="lat" :lng="lng" :title="title" />
    </MsgWrap>
</template>
<script>
import CLocation from '@/components/Msg/components/Type/Location.vue';

export default {
    name: 'Msg-Wechat-location',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        content() {
            return `${this.msg.day} ${this.msg.time}`;
        },
        data() {
            return this.msg.$Wechat.data;
        },
        location() {
            return this.data.$location;
        },
        title() {
            return this.location.label;
        },
        lat() {
            return this.location.x;
        },
        lng() {
            return this.location.y;
        },
    },
    components: {
        CLocation,
    },
};
</script>
<style lang="sass" scoped></style>
