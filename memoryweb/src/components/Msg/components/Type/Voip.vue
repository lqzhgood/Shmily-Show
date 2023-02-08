<template>
	<div class="Msg-common-voip">
		<div class="content">
			<img :src="`/static/msg/source/Common/icon/voip-${iconType}.png`" class="icon" data-is-icon />
			<span class="text">{{type}} {{desc}}</span>
		</div>
	</div>
</template>
<script>
export default {
	name: 'Msg-common-voip',
	props: {
		type: {
			type: String,
			default: '视频',
		},
		desc: String,
	},
	data: () => ({}),
	computed: {
		iconType() {
			if (this.type.includes('语音')) {
				return 'voice';
			} else if (this.type.includes('视频')) {
				return 'video';
			} else {
				return 'video';
			}
		},
	},
};
</script>
<style lang="sass" scoped>
.Msg-common-voip
    .content
        max-width: 420px
        word-wrap: break-word
        img.icon
            display: inline-block
            max-width: 21px
            vertical-align: middle
            margin: 0 5px
        .text
            display: inline-block
            vertical-align: middle
</style>