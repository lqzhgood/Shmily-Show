<template>
	<div @click="openMap()" class="msg-common-location">
		<h4>{{title}}</h4>
		<div class="description">
			<div class="coordinates">
				<span>{{lat}}</span>
				<br />
				<span>{{lng}}</span>
			</div>
			<img class="icon" data-is-icon src="/static/msg/source/Common/icon/map.jpg" />
		</div>
	</div>
</template>
<script>
import { QQ_MAP_LOCATION_API } from '@/utils/const.js';

export default {
	name: 'msg-common-location',
	props: {
		title: String,
		content: {
			type: String,
			default: '',
		},
		lat: [Number, String],
		lng: [Number, String],
		apiType: {
			type: String,
			default: 'qq',
		},
	},
	data: () => ({}),
	computed: {},
	methods: {
		openMap() {
			let url;
			switch (this.apiType) {
				default:
					url = QQ_MAP_LOCATION_API(this.title, this.content, this.lat, this.lng);
					break;
			}
			window.open(url);
		},
	},
};
</script>
<style lang="sass" scoped>
.msg-common-location
    width: 240px
    min-height: 40px
    padding: 10px
    border-radius: 2px
    text-decoration: none
    color: #333
    cursor: pointer
    background: #fff
    h4
        font-size: 15px
        margin: 0
        padding: 5px 0px
        font-weight: 500
        word-wrap: break-word
    .description
        font-size: 12px
        color: #9c9c9c
        margin: 0
        padding: 0
        display: flex
        .coordinates
            flex: 1 1 auto
            line-height: 25px
        .icon
            margin-top: 4px
            width: 40px
            height: 40px
            background-size: 100%
            flex: 0 0 auto
</style>