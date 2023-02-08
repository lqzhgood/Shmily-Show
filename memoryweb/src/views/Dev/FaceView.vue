<template>
	<div class="Dev-Face">
		<el-form>
			<el-form-item label="source">
				<el-radio-group v-model="source">
					<el-radio label="QQ">QQ</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>

		<!-- 第一层 显示所有表情 -->
		<el-drawer
			:before-close="closeFaceAll"
			:destroy-on-close="false"
			:visible="faceAll.drawer"
			append-to-body
			size="90%"
			title="表情种类"
		>
			<el-card :key="t.type" class="faceType" shadow="hover" v-for="t in faceArrPre">
				<el-image
					:key="f.md5"
					:preview-src-list="[makeFaceUrl(f.type,f.files[0].md5,f.files[0].ext)]"
					:src="makeFaceUrl(f.type,f.files[0].md5,f.files[0].ext)"
					class="face"
					fit="scale-down"
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

			<!-- 第二层 type -->
			<el-drawer
				:before-close="closeFaceType"
				:destroy-on-close="false"
				:title="faceType.type"
				:visible.sync="faceType.drawer"
				append-to-body
				size="80%"
			>
				<div :key="t.alt" class="faceAlt" shadow="hover" v-for="(t) in faceType.faceTypeArr">
					<div :key="f.md5" v-for="f in t.files">
						<el-card :body-style="{display:'inline-block'}" :style="{display:'inline-block'}">
							<el-image
								:preview-src-list="[makeFaceUrl(faceType.type,f.md5,f.ext)]"
								:src="makeFaceUrl(faceType.type,f.md5,f.ext)"
								class="face"
								fit="scale-down"
								lazy
							></el-image>
							<div class="des">
								<el-button @click="selectFaceAlt(t,f)" class="button" type="text">{{f.alias?f.alias.length:'-'}}</el-button>
								<span @click="openFaceFolder(faceType.type)" class="type">
									<el-link>{{t.alt}}</el-link>
								</span>
							</div>
						</el-card>
						<el-card :style="{display:'inline-block'}" class="alias" v-if="f.alias">
							<el-image :key="a.md5" :src="makeFaceUrl(faceType.type,a.md5,a.ext,true)" fit="scale-down" v-for="a in f.alias"></el-image>
						</el-card>
					</div>
				</div>

				<!-- 第三层 alt -->
				<el-drawer
					:destroy-on-close="false"
					:title="`${faceType.type} - ${faceAlt.alt}`"
					:visible.sync="faceAlt.drawer"
					append-to-body
					size="70%"
				></el-drawer>
			</el-drawer>
		</el-drawer>
	</div>
</template>
<script>
import axiosServer from '@/plugins/axios-server';

export default {
	name: 'Dev-Face',
	data: () => ({
		source: 'QQ',
		type: '表情',
		faceArr: [],
		// 第一层
		faceAll: {
			drawer: false,
			typeMaxFace: 2, //预览图最多显示2个
			baseUrl: '',
		},
		// 第二层
		faceType: {
			type: '',
			loading: true,
			drawer: false,
			faceTypeArr: [],
		},
		// 第三层
		faceAlt: {
			alt: '',
			drawer: false,
			file: {},
		},
	}),
	computed: {
		faceArrPre() {
			return this.makeFaceJson(this.faceArr, 'type', this.faceAll.typeMaxFace);
		},
	},
	watch: {
		source: {
			immediate: true,
			async handler(v) {
				if (v) {
					await this.getFaceArr();
				}
				this.faceAll.drawer = Boolean(v);
			},
		},
	},
	methods: {
		closeFaceAll(done) {
			this.source = '';
		},
		closeFaceType() {
			this.faceType = {
				type: '',
				loading: true,
				drawer: false,
				faceTypeArr: [],
			};
		},
		closeFaceAlt() {
			this.faceAlt = { alt: '', drawer: false, file: {} };
		},
		async getFaceArr() {
			const {
				result: { baseUrl, faceArr },
			} = await axiosServer.get('/msg/modify/file/face/faceArr', {
				params: { source: this.source, type: this.type },
			});
			this.faceAll.baseUrl = baseUrl;
			this.faceArr = faceArr;
		},
		makeFaceUrl(type, md5, ext, alias = false) {
			return `${this.faceAll.baseUrl}/${type}/${alias ? 'alias/' : ''}${md5}${ext}`;
		},
		async selectFaceType(t) {
			this.faceType.type = t;
			this.faceType.drawer = true;
			await this.getFaceTypeArr();
		},
		selectFaceAlt(t, f) {
			console.log('t', t, f);
			this.faceAlt.alt = t.alt;
			this.faceAlt.drawer = true;
			this.faceAlt.file = f;
		},
		makeFaceJson(arr, key, max) {
			return arr.reduce((pre, cV) => {
				let f = pre.find(v => v[key] === cV[key]);
				if (!f) {
					f = { [key]: cV[key], faces: [] };
					pre.push(f);
				}
				if (!max || f.faces.length < max) f.faces.push(cV);
				return pre;
			}, []);
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
		async getFaceTypeArr() {
			const {
				result: { faceTypeArr },
			} = await axiosServer.get(`/msg/modify/file/face/${this.faceType.type}/json`, {
				params: {
					source: this.source,
					type: this.type,
				},
			});
			this.faceType.faceTypeArr = faceTypeArr;
		},
	},
};
</script>
<style lang="sass" scoped>
.faceType
    margin: 0 10px 10px 0
    ::v-deep
        > .el-card__body
            padding: 10px
            maxWidth: 300px
            display: inline-block
    .face
        width: 100px
        height: 100px
    .des
        display: flex
        justify-content: space-between
        .button
            padding: 0
.faceAlt
    // display: inline-block
    outline: 2px dashed #999
    margin: 10px
    ::v-deep
        > .el-card__body
            padding: 10px
    .face
        width: 100px
        height: 100px
    .des
        display: flex
        justify-content: space-between
        .button
            padding: 0
</style>