<template>
    <MsgWrap>
        <CVoip :desc="desc" :type="text" />
    </MsgWrap>
</template>
<script>
import CVoip from '@/components/Msg/components/Type/Voip.vue';

export default {
    name: 'Msg-Wechat-voip',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        data() {
            return this.msg.$Wechat.data;
        },
        desc() {
            return this.data.$des_voip;
        },
        text() {
            return this.data.$text_voip;
        },
    },
    components: {
        CVoip,
    },
};
</script>
<style lang="sass" scoped></style>
