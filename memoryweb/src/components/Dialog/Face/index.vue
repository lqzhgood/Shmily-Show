<template>
	<el-dialog
		:close-on-click-modal="false"
		:modal="false"
		:visible.sync="faceDialog"
		class="dialogFace"
		destroy-on-close
		fullscreen
		title="仅限新增表情,[Alias表情]请手动修改 _faceArr.json 并执行 merger.js"
	>
		<div class="dialog_body">
			<el-card class="currFace">
				<slot></slot>
			</el-card>
			<div class="faceWrap">
				<el-card :body-style="{padding: 0}" :key="t.type" class="faceType" shadow="hover" v-for="t in faceArrTypes">
					<el-image
						:key="f.md5"
						:preview-src-list="[makeFaceUrl(f)]"
						:src="makeFaceUrl(f)"
						class="face"
						lazy
						v-for="f in t.faces"
					></el-image>
					<div class="des">
						<el-button @click="selectFaceType(t.type)" class="button" type="text">选择</el-button>
						<span @click="openFaceFolder(t.type)" class="type">
							<el-link>{{t.type}}</el-link>
						</span>
					</div>
				</el-card>
			</div>
		</div>
	</el-dialog>
</template>
<script>
import axiosServer from '@/plugins/axios-server';

export default {
	name: 'Dialog-Face',
	async mounted() {
		const {
			result: { baseUrl, faceArr },
		} = await axiosServer.get('/msg/modify/file/face/faceArr', {
			params: { source: this.source, type: this.type },
		});
		this.baseUrl = baseUrl;

		this.faceArrTypes = faceArr.reduce((pre, cV) => {
			let f = pre.find(v => v.type === cV.type);
			if (!f) {
				f = { type: cV.type, faces: [] };
				pre.push(f);
			}
			if (f.faces.length < this.typeMaxFace) f.faces.push(cV);
			return pre;
		}, []);
	},
	props: {
		source: String,
		type: String,
		show: Boolean,
	},
	data: () => ({
		typeMaxFace: 2,
		baseUrl: '',
		upFacePreSrc: '',
		faceArrTypes: [],
	}),
	watch: {
		faceDialog(v) {
			console.log('v', v);
		},
	},
	computed: {
		faceDialog: {
			get() {
				return this.show;
			},
			set(v) {
				this.$emit('update:show', v);
			},
		},
	},
	methods: {
		selectFaceType(v) {
			this.$emit('selectFaceType', v);
			this.faceDialog = false;
		},
		makeFaceUrl(f) {
			return `${this.baseUrl}/${f.type}/${f.files[0].md5}${f.files[0].ext}`;
		},
		openFaceFolder(faceType) {
			axiosServer.get('/msg/modify/file/face/openFolder', {
				params: {
					source: this.source,
					type: this.type,
					faceType,
				},
			});
		},
	},
};
</script>
<style lang="sass" scoped>
.dialog_body
    display: flex
    align-items: flex-start
    .currFace
        flex: 0 0 150px
        margin-right: 10px
    .faceWrap
        flex: 1 1 auto
        display: flex
        flex-wrap: wrap
        .faceType
            margin: 0 10px 10px 0
            .face
                width: 100px
                height: 100px
            .des
                display: flex
                justify-content: space-between
                .button
                    padding: 0
</style>
