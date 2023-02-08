<template>
	<div class="Msg-Source-MobileQQ-Android-mixMsg">
		<MsgWrap :key="i" class="msgWrap" v-for="(c,i) in msgArr">
			<CImage :src="c.data.imgUrl" v-if="c.type === types.MobileQQ_Android_type_图片" />
			<CText :html="c.html" v-else-if="c.type === types.MobileQQ_Android_type__文本"></CText>
			<CEmoticon
				:desc="c.data.desc"
				:mark="c.data.mark"
				:packName="c.data.packName"
				:src="c.data.webUrl"
				v-else-if="c.type === types.MobileQQ_Android_type_自定义表情"
			/>
			<CText :html="c.html" v-else></CText>
		</MsgWrap>
	</div>
</template>

<script>
const {
	MobileQQ_Android_type__文本,
	MobileQQ_Android_type_图片,
	MobileQQ_Android_type_自定义表情,
} = require('../types.js');

export default {
	name: 'Msg-MobileQQ-Android-audio',
	props: {
		msg: Object,
	},
	data: () => ({
		types: {
			MobileQQ_Android_type__文本,
			MobileQQ_Android_type_图片,
			MobileQQ_Android_type_自定义表情,
		},
	}),
	computed: {
		data() {
			return this.msg.$MobileQQ.data;
		},
		msgArr() {
			return this.data.mixArr;
		},
	},
	components: {
		CText: () => import('@/components/Msg/components/Type/Text.vue'),
		CImage: () => import('@/components/Msg/components/Type/Image/index.vue'),
		CEmoticon: () => import('@/components/Msg/components/Type/Emoticon.vue'),
	},
};
</script>
<style lang="sass" scoped>
.Msg-Source-MobileQQ-Android-mixMsg
    .msgWrap
        padding-bottom: 0
        &:last-child
            padding-bottom: 10px
</style>