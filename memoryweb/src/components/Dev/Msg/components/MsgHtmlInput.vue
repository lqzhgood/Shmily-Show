<template>
    <div>
        <Snippets :snippets="currSourceSnippets" />

        <Input :rows="canDel ? 1 : 14" class="text" placeholder="请输入JSON" ref="input" v-model="textInner" />
    </div>
</template>
<script>
import _ from 'lodash';

import HtmlInputMix from '@/components/Dev/Common/components/HtmlInput/mix';

import R_Common from './rules/common.js';
import R_QQ from './rules/QQ.js';
import R_MobileQQ_Android from './rules/MobileQQ-Android.js';
import R_Wechat from './rules/Wechat.js';

const mc = require('@/components/Msg/utils/isSource.js');

export default {
    mixins: [HtmlInputMix],
    props: {
        canDel: {
            require: true,
            type: Boolean,
        },
        msgModify: {
            type: [Object, String], // String is only ""
        },
    },
    data: () => ({}),
    computed: {
        currSourceSnippets() {
            return this.snippets.filter(s => !s.filter || s.filter(this.msg));
        },
        snippets() {
            const _this = this;
            const k = this.replaceKey; // eslint-disable-line

            return [
                ...R_Common(_this),
                ..._this.addSnippetFilter(R_QQ(_this), mc.isQQ),
                ..._this.addSnippetFilter(R_MobileQQ_Android(_this), mc.isMobileQQ_Android),
                ..._this.addSnippetFilter(R_Wechat(_this), mc.isWechat),
            ].map(s => {
                s.fn = _this.changeMsg(s.fn);
                return s;
            });
        },
    },
    methods: {
        addSnippetFilter(rules, fn) {
            return rules.map(s => {
                if (!s.filter) s.filter = fn;
                return s;
            });
        },
        changeMsg(handler) {
            return async () => {
                const msg = await handler(_.cloneDeep(this.msg), this.msgModify);
                if (!msg) return;
                this.textInner = JSON.stringify(msg, null, 4);
            };
        },
    },
};
</script>
<style lang="sass" scoped>
.text
    display: block
    width: 800px
</style>
