<template>
    <MsgWrap>
        <CEmoticon :desc="desc" :mark="mark" :packName="packName" :src="src" />
    </MsgWrap>
</template>
<script>
import CEmoticon from '@/components/Msg/components/Type/Emoticon.vue';

export default {
    name: 'Msg-MobileQQ-Android-emoji',
    props: {
        msg: Object,
    },
    computed: {
        src() {
            return this.msg.$MobileQQ.data.webUrl;
        },
        packName() {
            return this.msg.$MobileQQ.data.packName;
        },
        desc() {
            return this.msg.$MobileQQ.data.desc;
        },
        mark() {
            return this.msg.$MobileQQ.data.mark;
        },
    },
    components: {
        CEmoticon,
    },
};
</script>
<style lang="sass" scoped></style>
