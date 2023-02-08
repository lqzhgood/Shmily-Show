<template>
	<div :class="{ isDevNoTitleFlag: isDevNoTitleFlag }" class="msg-common-emoticon">
		<img :alt="`${packName}-${desc}`" :src="src " :title="`${packName}-${desc}`" class="emoji" />
		<div class="desc">
			<el-link :title="mark" type="primary">{{packName}}-{{desc}}</el-link>
		</div>
	</div>
</template>
<script>
export default {
	name: 'msg-common-emoticon',
	props: {
		src: String,
		packName: {
			type: String,
			default: '其他',
		},
		desc: {
			type: String,
			default: '未知',
		},
		mark: {
			type: String,
			default: '',
		},
	},
	data: () => ({}),
	computed: {
		isDev() {
			return this.$store.getters['app/isDev'];
		},
		isDevNoTitleFlag() {
			return this.packName === '其他' || this.desc === '未知';
		},
	},
};
</script>
<style lang="sass" scoped>
.msg-common-emoticon
    text-align: center
    .emoji
        max-width: 100px !important
        cursor: pointer

.isDevNoTitleFlag
    outline: 1px dashed #f00
</style>