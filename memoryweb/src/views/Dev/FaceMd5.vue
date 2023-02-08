<template>
	<el-card>
		<div>
			<el-button @click="merger" type="primary">Merger</el-button>
		</div>
		<el-card class="box" header="Face">
			<el-upload :action="url" :data="upData" :http-request="postUpFile" accept="image/*" drag>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">
					将文件拖到此处，或
					<em>点击上传</em>
				</div>
				<div class="el-upload__tip" slot="tip"></div>
			</el-upload>
		</el-card>
		<el-card class="box" header="Res">
			<pre> {{JSON.stringify({...result},null,4)}}</pre>
		</el-card>
	</el-card>
</template>
<script>
import { MODIFY_SERVER } from '@/config';
import axiosServer from '@/plugins/axios-server';

export default {
	name: 'Dev-Face-Md5',
	data: () => ({
		url: MODIFY_SERVER + '/msg/modify/file/add',
		upData: {
			source: 'QQ',
			type: '表情',
		},
		result: {},
	}),
	methods: {
		async postUpFile({ data, file: inputFile }) {
			const faceInfo = await this.checkFaceHas(inputFile, data);
			this.result = faceInfo;
		},
		async checkFaceHas(inputFile, sendData) {
			const { source, type, msg } = sendData; // eslint-disable-line
			const { code, result } = await axiosServer.file('/msg/modify/file/face/md5', inputFile, sendData); // eslint-disable-line
			return result;
		},
		async merger() {
			const { result } = await axiosServer.get('/msg/modify/file/face/merger', { params: this.upData });
			this.$message.success(result);
		},
	},
};
</script>
<style lang="sass" scoped>
.box
    display: inline-block
    width: 500px
    margin: 20px
</style>