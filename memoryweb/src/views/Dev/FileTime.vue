<template>
	<el-card>
		<el-card class="box" header="Face">
			<el-upload :http-request="postUpFile" action="#" drag>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">
					将文件拖到此处，或
					<em>点击上传</em>
				</div>
				<div class="el-upload__tip" slot="tip"></div>
			</el-upload>
		</el-card>
		<el-card class="box" header="Res">
			<pre> {{JSON.stringify(result,null,4)}}</pre>
		</el-card>
	</el-card>
</template>
<script>
import dayjs from 'dayjs';

export default {
	name: 'Dev-File-Time',
	data: () => ({
		result: {},
	}),
	methods: {
		postUpFile({ data, file: inputFile }) {
			console.log('inputFile', inputFile);

			const obj = {};
			// eslint-disable-next-line
			for (const key in inputFile) {
				const v = inputFile[key];
				obj[key] = v;
			}

			obj.day = dayjs(inputFile.lastModified).format('YYYY-MM-DD');
			obj.time = dayjs(inputFile.lastModified).format('HH:mm:ss');
			obj.ms = inputFile.lastModified;

			this.result = obj;
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