<template>
	<span class="actions">
		<el-button @click="createFolder(commentSId)" icon="el-icon-folder-add" title="创建并打开文件夹" type="warning"></el-button>
	</span>
</template>
<script>
import axiosServer from '@/plugins/axios-server';

export default {
	name: 'Dev-Comment-Actions',
	props: {
		commentSId: String,
	},
	methods: {
		createFolder(id) {
			axiosServer.get(`/comment/createFolder?id=${id}`).catch(err => {
				console.warn('❌', err.message);
			});
		},
	},
};
</script>
<style lang="sass" scoped>
.actions
    float: right
    margin-right: 20px
</style>