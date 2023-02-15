<template>
    <div class="timeLine">
        <el-divider class="year" v-if="msgPartIndex === 0 || msg.day !== previousMsg.day">{{ msg.day }}</el-divider>
        <div class="time">
            <span :title="title">{{ content }}</span>
        </div>
    </div>
</template>
<script>
import _ from 'lodash';
import dayjs from 'dayjs';
import { FORMAT_TIME } from '@/utils/const.js';

export default {
    name: 'TimeLine',
    props: {
        msg: {
            type: Object,
            require: true,
        },
        msgPartIndex: {
            type: Number,
            require: true,
        },
        msgPart: {
            type: Array,
            require: true,
        },
    },
    data: () => ({}),
    computed: {
        previousMsg() {
            return this.msgPart[this.msgPartIndex - 1];
        },
        realTime() {
            let realTime = '';
            realTime = _.get(this.msg, '$MobileQQ.data.s60RealTime', '');
            return realTime;
        },
        title() {
            let title = this.formatTitleTime(this.msg.ms);
            if (this.realTime) title += `\n${this.realTime} (${this.msg.device}上的本地时间)`;
            return title;
        },
        content() {
            let content = this.msg.time;
            if (this.realTime) content += ' ′';
            return content;
        },
    },
    methods: {
        formatTitleTime(d) {
            return dayjs(d).format(`${FORMAT_TIME} ddd`);
        },
    },
};
</script>
<style lang="sass" scoped>
.timeLine
    .year
        ::v-deep
            .el-divider__text
                font-size: 12px
    .time
        color: #333
        text-align: center
        font-size: 0.6em
        margin-bottom: 5px
</style>
