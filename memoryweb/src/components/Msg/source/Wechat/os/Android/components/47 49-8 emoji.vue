<template>
    <MsgWrap>
        <CEmoticon :desc="desc" :packName="packName" :src="src" />
    </MsgWrap>
</template>
<script>
import CEmoticon from '@/components/Msg/components/Type/Emoticon.vue';

import _ from 'lodash';
export default {
    name: 'Msg-Wechat-emoji',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        data() {
            return this.msg.$Wechat.data;
        },
        src() {
            return _.get(this.data, '$url_emoji') || '/static/msg/source/Wechat/img/pic_delete.png';
        },
        packName() {
            let p = _.get(this.data, '$packName');

            // 测试 Get\WECHAT\Tools\补充表情包名称 时使用
            // const json = require('@/assets/data/wechatEmojiPackageName.json');
            // if (p.startsWith('stiker_')) {
            // 	const c = json.find(j => j.pId === p).pName;
            // 	if (c) p = c;
            // }

            return p || '其他';
        },
        desc() {
            return _.get(this.data, '$desc') || '未知';
        },
    },
    components: {
        CEmoticon,
    },
};
</script>
<style lang="sass" scoped></style>
