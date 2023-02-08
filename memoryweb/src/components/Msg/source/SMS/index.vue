<template>
	<MsgWrap>
		<div :class="smsType" class="source-SMS" v-html="msg.html"></div>
	</MsgWrap>
</template>
<script>
import _ from 'lodash';

export default {
	name: 'Msg-Source-SMS',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		smsType() {
			return _.get(this.msg, '$SMS.type');
		},
	},
};
</script>
<style lang="sass" scoped>
.source-SMS
    &.s60_sms // 覆盖彩信下面的 html 里面的样式
        ::v-deep
            *
                display: block
                margin-bottom: 5px
</style>
