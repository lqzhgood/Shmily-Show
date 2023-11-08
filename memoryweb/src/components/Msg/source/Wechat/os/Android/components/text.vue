<template>
    <MsgWrap>
        <CText :html="msg.html">
            <template #icon v-if="isVoip">
                <img src="/static/msg/source/Common/icon/voip-voice.png" class="icon" data-is-icon />
            </template>
        </CText>
    </MsgWrap>
</template>
<script>
import CText from '@/components/Msg/components/Type/Text.vue';
import { is_Wechat_Android_type__消息_发起语音通话 } from '../isTypes';
export default {
    name: 'Msg-Wechat-text',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        isVoip() {
            return is_Wechat_Android_type__消息_发起语音通话(this.msg);
        },
    },
    components: {
        CText,
    },
};
</script>
<style lang="sass" scoped></style>
