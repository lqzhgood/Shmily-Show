<template>
	<div class="msg-common-audio">
		<div>语音消息时长 {{length}} s</div>
		<audio :src="src" controls></audio>
		<div class="stt" v-if="stt">
			<el-divider class="hr">
				<i class="el-icon-microphone"></i>
			</el-divider>
			<div>{{stt}}</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'msg-common-audio',
	data: () => ({}),
	props: {
		src: String,
		length: {
			type: Number,
			default: -1,
		},
		stt: {
			type: String,
			default: '',
		},
	},
};
</script>
<style lang="sass" scoped>
.msg-common-audio
    .hr
        margin: 12px 0
    .stt
        font-style: italic
</style>