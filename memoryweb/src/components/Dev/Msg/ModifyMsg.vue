<template>
	<div
		:class="[{'isModify':isModify},modifyType]"
		@click.ctrl="modifyMsg('delete')"
		class="modify-msg"
		title="增删改查 Msg 内容, 按 Ctrl 点击可以快速 delete"
		v-loading="loading"
	>
		<el-popover popper-class="EditMsgBox" v-model="visible">
			<div class="wrap" v-if="visible" v-loading="loading">
				<div class="btns">
					<div class="left">
						<el-button :plain="msgIsNotModify" @click="initMsgEdit()" class="left" type="success">重置</el-button>
						<el-button @click="msgText = ''" class="left" type="warning" v-if="msgText != ''">清空</el-button>
						<el-button @click="msgChangeDirection()" class="left" title="交换发件人和收件人" type="info">交换</el-button>
						<el-button :disabled="!canDel" :loading="loading" @click="modifyMsg('delete')" class="left" type="danger">删除</el-button>
						<el-button
							:disabled="!msgIsNotModify"
							@click="updateByFileShow = true"
							class="left"
							title="修改后的HTML无法更新文件,如需更新文件请请重置"
							type="info"
						>文件</el-button>
					</div>
					<div class="center">
						注意
						<code>html(仅显示)</code>
						和
						<code>content(仅搜索)</code>
						属性的区别
					</div>
					<div class="right">
						<el-button @click="visible = false" type="text">取消</el-button>
						<el-button
							:disabled="!(isMsgParseOk && canModify)"
							:loading="loading"
							@click="modifyMsg('modify')"
							type="primary"
						>修改</el-button>
					</div>
				</div>
				<hr />

				<!-- HTML 编辑区 -->
				<template v-if="!updateByFileShow">
					<MsgHtmlInput :canDel="canDel" :msg="msg" :msgModify="msgModify" :show="visible" :text.sync="msgText" />

					<template v-if="canDel">
						<el-checkbox :title="`只会删除 [html] 内资源, [${msgSpecialKey}] 内资源需要手动删除`" v-model="deleteAssets">删除资源</el-checkbox>
						<ul>
							<li :key="i" v-for="(u, i) in srcArr">
								<el-link :href="u" target="_blank">{{ u }}</el-link>
								<img :src="u" style="margin:0 10px;max-height:100px;vertical-align: middle;" v-if="isPic(u)" />
								<el-link :href="delSrc(u)" :title="delSrc(u)" target="_blank">
									<i class="el-icon-brush"></i>
								</el-link>
							</li>
						</ul>
						<div v-if="deleteAssets">
							<p class="noAssetsInHtml" v-if="srcArr.length === 0">msg.html 中没有找到可以删除的资源</p>
							<div v-if="msgSpecialKey">
								<el-divider>以下 msg.{{msgSpecialKey}} 内资源需要手动删除</el-divider>
								<pre class="msgSpecialKeyAssets">{{JSON.stringify(msg[msgSpecialKey],null,4)}}</pre>
							</div>
						</div>
					</template>
				</template>
				<UpdateByFile
					:msg="msg"
					@update:updateByFileShow="v=>updateByFileShow=v"
					@updateMsgText="getMsgTextByFileUpdate"
					v-if="updateByFileShow"
				/>
			</div>

			<i class="el-icon-edit" slot="reference"></i>
		</el-popover>
	</div>
</template>
<script>
import _ from 'lodash';
import { Message } from 'element-ui';

const { getPublicFileDirByHtml, IS_NEED_DELETE_FLAG } = require('@/common.js');
import { EXT_IMAGE } from '@/utils/const.js';
import { changeDirection } from '@/components/Dev/Common/utils';
import MsgHtmlInput from './components/MsgHtmlInput.vue';
import UpdateByFile from './components/UpdateByFile.vue';

export default {
	mounted() {
		if (this.msg.source === 'Camera') {
			this.deleteAssets = true;
		}
		this.initMsgEdit();
	},
	props: {
		msg: Object,
	},
	data: () => ({
		isModify: false,
		modifyType: '',
		visible: false,
		loading: false,
		deleteAssets: false,
		msgText: '',
		updateByFileShow: false,
	}),
	computed: {
		msgSpecialKey() {
			return Object.keys(this.msg).find(v => v.startsWith('$'));
		},
		partOfMsg() {
			// 这里控制显示的 msg 内容, 有时候 $msgSpecialKey 太长,就这里隐藏掉
			// return _.pickBy(this.msg, (v, k) => !k.startsWith('$'));
			return this.msg;
		},
		canDel() {
			return this.msgText == '';
		},
		canModify() {
			return !_.isEqual(this.partOfMsg, this.msgModify);
		},
		msgModify() {
			try {
				const json = JSON.parse(this.msgText);
				return json;
			} catch (error) {
				return '';
			}
		},
		isMsgParseOk() {
			return this.msgModify == '' ? false : true;
		},
		srcArr() {
			return _.uniq(getPublicFileDirByHtml(this.msg.html));
		},
		msgIsNotModify() {
			return this.msgText === JSON.stringify(this.partOfMsg, null, 4);
		},
	},
	methods: {
		getMsgTextByFileUpdate({ msg, autoSubmit }) {
			this.msgText = msg;
			this.updateByFileShow = false;
			if (autoSubmit) {
				this.modifyMsg('modify');
			}
		},
		msgChangeDirection() {
			try {
				this.msgText = changeDirection(this.msgText);
			} catch (error) {
				Message.error('错误' + error.message);
			}
		},
		initMsgEdit() {
			this.msgText = JSON.stringify(this.partOfMsg, null, 4);
			this.updateByFileShow = false;
		},
		modifyMsg(type) {
			this.modifyType = type;
			let d;
			switch (type) {
				case 'delete':
					d = {
						type,
						nMsg: this.msg,
						deleteAssets: this.deleteAssets,
					};
					break;
				case 'modify':
					d = {
						type,
						nMsg: Object.assign(_.cloneDeep(this.msg), _.cloneDeep(this.msgModify)),
					};
					break;
				default:
					throw new Error('error type');
			}

			this.$store.commit('dev/pushModifyMsg', d);
			this.visible = false;
			this.loading = false;
			this.isModify = true;
		},
		isPic(u) {
			return EXT_IMAGE.some(ext => u.toLowerCase().endsWith(ext));
		},
		delSrc(u) {
			const arr = u.split('.');
			arr[arr.length - 2] += IS_NEED_DELETE_FLAG;
			return arr.join('.');
		},
	},
	components: {
		MsgHtmlInput,
		UpdateByFile,
	},
};
</script>
<style lang="sass" scoped>
.modify-msg
    position: absolute
    left: -10px
    bottom: -20px
    cursor: pointer
    opacity: 0.1
    &:hover
        opacity: 1
    &.isModify
        opacity: 1
        background: #ff85c0
        &.delete
            color: #ff7875
            background: none
        &.modify
            color: #faad14
            background: none
</style>

<style lang="sass">
.EditMsgBox
    .wrap
        position: relative
        .btns
            margin-bottom: 10px
            display: flex
            .center
                display: flex
                justify-content: center
                align-items: center
                flex: 1 1 auto
                text-align: center
                font-size: 12px
                code
                    margin: 0 5px
        .noAssetsInHtml
            text-align: center
            margin: 0
        .msgSpecialKeyAssets
            max-height: 300px
            overflow: auto
</style>
