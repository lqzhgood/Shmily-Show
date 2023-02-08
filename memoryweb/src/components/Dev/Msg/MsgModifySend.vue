<template>
	<div id="MsgModifySend" v-if="length">
		<el-button-group>
			<el-button :loading="loading" @click="log()" class="btn" title="点我F12打印数据" type="success">📝</el-button>
			<el-button :loading="loading" @click="send()" class="btn" title="发送 msg Modify" type="danger">{{length}}</el-button>
		</el-button-group>
	</div>
</template>
<script>
export default {
	data: () => ({
		loading: false,
	}),
	computed: {
		modifyMsgArr() {
			return this.$store.state.dev.modifyMsgArr;
		},
		length() {
			return this.modifyMsgArr.length;
		},
	},
	methods: {
		async send() {
			if (this.loading) return;
			this.loading = true;
			await this.$store.dispatch('dev/ModifyMsg');
			this.loading = false;
		},
		log() {
			console.log('this.modifyMsgArr', this.modifyMsgArr);
			for (let i = 0; i < this.modifyMsgArr.length; i++) {
				const { type, nMsg, deleteAssets } = this.modifyMsgArr[i];
				console.group(`${nMsg.id}`);
				console.log(type, deleteAssets);
				console.log('nMsg', nMsg);
				console.groupEnd(`${nMsg.id}`);
			}
		},
	},
};
</script>
<style lang="sass" scoped>
#MsgModifySend
    position: fixed
    top: 20px
    left: 100px
    z-index: 50
    .btn
        margin: 0
</style>