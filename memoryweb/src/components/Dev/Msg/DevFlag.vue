<template>
    <!-- // 这里放的是测试时为了方便调试显示的一些东西,显示在 msg 下面 -->
    <div class="devFlag">
        <ShowField :msg="msg" field="same" />
        <ShowField :msg="msg" field="warn" />
        <el-tag v-if="msg.source === 'QQ' && msg.content.trim() === ''">没有内容</el-tag>
        <el-tag type="danger" v-if="msgIsSame">↑ msgIsSame ↑</el-tag>
        <div :style="{ background: msSameColor }" class="line" title="前后的消息时间一致" v-if="msSameColor"></div>
        <el-tag v-if="msg.source === 'QQ' && /\[(?!(自动回复|Android|iPhone|IP地址)).+\]/.test(msg.html)">
            好像这是一条表情
        </el-tag>
        <!-- 【条件】的跳转按钮 -->
        <!-- <el-button @click="goMsg('pre')">上一条</el-button>
		<el-button @click="goMsg('next')">下一条</el-button>-->
    </div>
</template>
<script>
import _ from 'lodash';
import { color } from '@/utils/dev.js';

export default {
    props: {
        msg: Object,
        msgPart: Array,
        msgPartIndex: Number,
        listIndex: Number,
    },
    data: () => ({}),
    computed: {
        msgAll() {
            return this.$store.state.msgAll;
        },
        previousMsg() {
            return this.msgPart[this.msgPartIndex - 1] || {};
        },
        nextMsg() {
            return this.msgPart[this.msgPartIndex + 1] || {};
        },
        msgIsSame() {
            return this.msgSameHandle(this.msg, this.previousMsg);
        },
        msSameColor() {
            return this.msg.ms === this.previousMsg.ms || this.msg.ms === this.nextMsg.ms ? color.get(this.msg.ms) : '';
        },
    },
    methods: {
        msgSameHandle(o, n) {
            return o.ms === n.ms && o.html === n.html && o.source == n.source;
        },
        async goMsg(type) {
            // !!! 跳转消息 至于怎么跳，方法自己写吧
            const fn = this.goWechatLost;

            let msg;

            if (type === 'pre') {
                const part = this.msgAll.slice(0, this.listIndex);
                msg = part.findLast(v => fn(v));
            } else {
                const part = this.msgAll.slice(this.listIndex + 1);
                msg = part.find(v => fn(v));
            }

            if (!msg) {
                this.$message.error('没有找到相关信息');
            } else {
                await this.$store.dispatch('query/search/sendSearch', { search: {}, id: msg.id });
            }
        },
        goWechatLost(m) {
            if (m.source !== 'Wechat') return false;
            const data = m.$Wechat.data;
            switch (m.type) {
                case '自定义表情':
                    return !data.$url_emoji;
                // case '图片':
                // 	return !(Array.isArray(data.$imgUrl) ? data.$imgUrl[0] : data.$imgUrl);
                // case '视频':
                // 	return !data.$mp4info.mp4Url;
                // case '语音':
                // 	return !data.$mp3Info.mp3Url;
                default:
                    return false;
            }
        },
        goNumberMsg(m) {
            if (!m.sender || !m.receiver) {
                return false;
            }
            return ['13574228815', '13973335059', '13908437618', '18908439510'].some(
                n => m.sender.includes(n) || m.receiver.includes(n),
            );
        },
        goEmptyMsg(m) {
            return m.html === '';
        },
        goWechatVideo(m) {
            return m.source === 'Wechat' && m.type === '视频' && m.$Wechat.data.$mp4info.mp4Url;
        },
        goQQImgProblemMsg(m) {
            return (
                m.source === 'QQ' &&
                ((m.html.includes('lostImg') && !m.html.includes('魔法表情') && !m.html.includes('超级表情')) ||
                    /\[(?!自动回复|Android|iPhone|IP地址).+\]/.test(m.html)) &&
                !m.content.startsWith('[图] {{诺 小魚、') &&
                !m.content.startsWith('[图] {{诺 小魚、') &&
                !m.content.startsWith('[图]{{诺 小魚、')
            );
        },
    },
    components: {
        ShowField: {
            props: {
                msg: Object,
                field: null,
            },
            render(h) {
                const { msg, field } = this.$props;
                // 早期没考虑集中在 _$Dev 中， 这里兼容处理一下
                const v = _.get(msg, `_$Dev.${field}`) ?? _.get(msg, field);
                return v ? <el-tag>{`${field} - ${v}`}</el-tag> : null;
            },
        },
    },
};
</script>
<style lang="sass" scoped>
.devFlag
    position: absolute
    top: 100%
    left: 10px
    // background: #bae637
    width: 100%
    text-align: center
    .line
        height: 4px
</style>
