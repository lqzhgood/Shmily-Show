<template>
	<MsgWrap class="source-Camera">
		<div class="topMark">
			<!-- GPSLongitude -->
			<img
				@click="openCameraMap()"
				class="icon map"
				no-img-view
				src="/static/msg/source/Camera/icon/map.png"
				v-if="showGpsIcon"
			/>
		</div>
		<div class="content" v-html="msg.html"></div>
	</MsgWrap>
</template>
<script>
import { GpsToNum, openWin } from '@/utils/index';
import { BAIDU_MAP_LOCATION_API } from '@/utils/const';
import dayjs from 'dayjs';

export default {
	name: 'Msg-Camera',
	props: {
		msg: {
			type: Object,
			require: true,
		},
	},
	data: () => ({}),
	computed: {
		showGpsIcon() {
			return this.msg?.$Camera?.exif?.GPSPosition;
		},
	},
	methods: {
		openCameraMap() {
			const m = this.msg;

			const lat = GpsToNum(m.$Camera.exif.GPSLatitude);
			const lng = GpsToNum(m.$Camera.exif.GPSLongitude);

			const title = m.device.replace(/\s/g, '_');
			const content = dayjs(m.ms).format('YYYY-MM-DD_HH:mm:ss');

			const url = BAIDU_MAP_LOCATION_API(title, content, lat, lng);
			openWin(url);
		},
	},
};
</script>
<style lang="sass" scoped>
.source-Camera
    .topMark
        position: absolute
        bottom: 5px
        right: 15px
        z-index: 1
        .icon
            max-width: 20px
            max-height: 20px
            cursor: pointer
    .content
        ::v-deep
            img
                width: 100%
</style>
