<template>
	<MsgWrap>
		<div :class="msg.direction === 'come'? 'left':'right' " class="wechat-audio">
			<div :class="{'error':isError}" :title="isError?`文件不存在 或 ${errorMsg}`:''" class="message-body">
				<audio :src="src" @error="error" @pause="isPlay = false" @play="isPlay = true" ref="audio"></audio>
				<span :class="{'voice-img-playing':isPlay}" :style="{'width':`${5*VoiceTime}px`}" @click="play" class="voice-img"></span>
				<span class="voice-duration">{{VoiceTime}}''</span>
			</div>
		</div>
	</MsgWrap>
</template>

<script>
// !!! 没进度条的音频播放都是耍流氓 还不如原生的
import _ from 'lodash';

export default {
	name: 'Msg-Wechat-audio',
	props: {
		msg: Object,
	},
	data: () => ({
		isPlay: false,
		isError: false,
		errorMsg: '',
	}),
	computed: {
		item() {
			return this.msg.$Wechat.webData;
		},
		mp3Info() {
			return this.item.$mp3Info;
		},
		src() {
			return _.get(this.mp3Info, 'mp3Url') || 'srcIsNull';
		},
		VoiceTime() {
			const t = _.get(this.mp3Info, 'time') || '-1';
			return Math.round(t);
		},
	},
	methods: {
		error($event) {
			if ($event.type === 'error') {
				this.isError = true;
				this.errorMsg = $event.target.error.message;
			}
		},
		play() {
			const audio = this.$refs.audio;
			if (audio.paused) {
				audio.play();
			} else {
				audio.pause();
			}
		},
	},
};
</script>
<style lang="sass" scoped>
.wechat-audio
    padding: 0
    .message-body
        max-width: 420px
        word-wrap: break-word
        border-radius: 2px
        padding: 10px
        display: inline-block
        &.error
            opacity: 0.3
            cursor: not-allowed
            .voice-img
                background-image: url('/static/msg/source/Wechat/img/voice_left.png')
                background-color: transparent
                mask: none
        .voice-img
            display: inline-block
            min-width: 20px
            max-width: 240px
            height: 20px
            background-size: 20px auto
            background-repeat: no-repeat
            vertical-align: top
            cursor: pointer
            mask: url('/static/msg/source/Wechat/img/voice_left.png') no-repeat
            mask-size: contain
            background-color: #52c41a
            &.voice-img-playing
                background-image: url('/static/msg/source/Wechat/img/voice_left_click.gif')
        .voice-duration
            color: #7f7f7f

.wechat-audio.right
    .message-body
        .voice-img
            transform: rotateY(180deg)
            transform-origin: center
        .voice-duration
            float: left
</style>