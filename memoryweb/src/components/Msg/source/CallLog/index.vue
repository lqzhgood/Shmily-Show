<template>
    <MsgWrap class="source-CallLog">
        <div class="content">
            <span>{{ callHumanStr }}</span>
            <div class="detail">
                <div class="location" v-if="location">
                    <i class="el-icon-location-information"></i>
                    {{ location }}
                </div>
                <div class="price" v-if="price">￥ {{ price }}</div>
            </div>
        </div>
    </MsgWrap>
</template>
<script>
import { formatSecond } from '@/utils/index.js';

const {
    CallLog_type_呼出未接,
    CallLog_type_呼出已接,
    CallLog_type_呼入挂断,
    CallLog_type_呼入未接,
    CallLog_type_呼入已接,
} = require('./types');

export default {
    name: 'Msg-Source-CallLog',
    data: () => ({}),
    props: {
        msg: {
            type: Object,
            require: true,
        },
    },
    computed: {
        data() {
            return this.msg?.$CallLog?.data || {};
        },
        duration() {
            return this.data?.duration;
        },
        location() {
            return this.data?.location;
        },
        price() {
            return this.data?.price;
        },
        callHumanStr() {
            const { type } = this.msg;
            const hmSec = formatSecond(this.duration);
            switch (type) {
                case CallLog_type_呼入已接:
                    return `通话 ${hmSec}`;
                case CallLog_type_呼入未接:
                    return `对方未接 响铃 ${hmSec}`;
                case CallLog_type_呼入挂断:
                    return '对方挂断';
                case CallLog_type_呼出已接:
                    return `通话 ${hmSec}`;
                case CallLog_type_呼出未接:
                    return '对方 未接/挂断';
                default:
                    throw new Error('unknown Type');
            }
        },
    },
};
</script>
<style lang="sass" scoped>
.source-CallLog
    .content
        padding: 0 10px
        min-width: 100px
        text-align: center
        .detail
            display: flex
            opacity: 0.8
            font-size: 13px
            &>div
                flex: 1 1 auto
                min-width: 50px
            .price
                text-align: right
            .location
                text-align: left
</style>
