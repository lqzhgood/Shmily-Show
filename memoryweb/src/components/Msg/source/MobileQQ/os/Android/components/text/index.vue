<template>
	<MsgWrap>
		<CText :html="msg.html">
			<template #icon v-if="typeIconSrc">
				<img :src="typeIconSrc" class="icon" data-is-icon />
			</template>
		</CText>
	</MsgWrap>
</template>
<script>
import CText from '@/components/Msg/components/Type/Text';

export default {
	name: 'Source-MobileQQ-Android-text',
	props: {
		msg: Object,
	},
	data: () => ({}),
	computed: {
		type() {
			return this.msg.type;
		},
		typeIconSrc() {
			switch (this.type) {
				case '动作':
					return require('./icon/action.svg');
				case '系统消息':
					return require('./icon/system.svg');
				case '撤回':
					return require('./icon/withdraw.png');
				default:
					// 纯消息
					return null;
			}
		},
	},
	components: {
		CText,
	},
};
</script>
<style lang="sass" scoped>
</style>