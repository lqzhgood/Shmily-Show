<template>
	<div class="detail">
		<el-row justify="space-between" type="flex">
			<el-col :span="12" class="left">
				<img :class="msg.device" :src="`/static/icon/device/${msg.device}.png`" class="icon" />
				<el-link :href="`/static/icon/device/${msg.device}.png`" target="_blank">{{ msg.device }}</el-link>
			</el-col>
			<el-col :span="12" class="right">
				<el-link :underline="false">{{ msg.source }}{{ msg.type ? `-${msg.type}` : '' }}</el-link>
			</el-col>
		</el-row>
		<el-divider class="hr">
			<span @click="copy(msg)" class="copy" title="复制链接">💌</span>
		</el-divider>
		<el-row class="mailName" justify="space-between" type="flex" v-if="msg.sender">
			<el-col :span="10" :title="msg.senderName" class="left">
				<b>{{ msg.senderName }}</b>
			</el-col>
			<el-col :span="4" class="center">
				<span class="direction">{{ `→` }}</span>
			</el-col>
			<el-col :span="10" :title="msg.receiverName" class="right">
				<b>{{ msg.receiverName }}</b>
			</el-col>
		</el-row>
		<el-row class="mailNum" justify="space-between" type="flex">
			<el-col :span="12" :title="msg.sender" class="left">{{ msg.sender }}</el-col>
			<el-col :span="12" :title="msg.receiver" class="right">{{ msg.receiver }}</el-col>
		</el-row>
	</div>
</template>
<script>
export default {
    name: "Components-Msg-infoDetail",
    props:{
        msg:Object,
    },
};
</script>
<style lang="sass" scoped>
.detail
    min-width: 220px !important
    text-align: center
    font-size: 12px
    white-space: nowrap
    .icon
        width: 10px
        vertical-align: middle
        margin-right: 10px
        &.PC
            width: 15px
        &.Phone
            width: 15px
    .mailName
        margin-bottom: 2px
        .direction
            position: relative
            top: 8px
    .hr
        margin: 10px 0
        .copy
            cursor: pointer
    .left
        text-align: left
    .center
        text-align: center
    .right
        text-align: right
    .mailName,.mailNum
        .left,.right
            max-width: 10em
            overflow: hidden
            text-overflow: ellipsis
</style>