<template>
	<div class="filter" shadow="hover">
		<el-form :model="searchForm" label-width="70px" ref="form">
			<el-form-item label="时间">
				<el-date-picker
					end-placeholder="结束日期"
					range-separator="至"
					start-placeholder="开始日期"
					type="datetimerange"
					v-model="searchForm.time"
					value-format="timestamp"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="消息类型">
				<div :key="s.label" class="sourceAndType" v-for="s in MSG_DICT.source">
					<el-checkbox
						:indeterminate="sourceAllValue[s.label].isIndeterminate"
						:value="sourceAllValue[s.label].check"
						@change="clickAllSource(s)"
						class="source"
					>
						<img :src="`./static/icon/source/${s.label}.png`" class="icon" />
						<b>{{ s.label }}</b>
					</el-checkbox>
					<el-checkbox-group class="type" v-model="searchForm.type[s.label]">
						<el-checkbox :key="t" :label="t" class="item" v-for="t in s.type">
							<img :src="`./static/icon/source/${s.label}-${t}.png`" class="icon" v-if="s.label === 'CallLog'" />
							<img :src="`./static/icon/type/${s.label}-${t}.png`" class="icon" v-else />
							<span class="text">{{ t }}</span>
						</el-checkbox>
					</el-checkbox-group>
				</div>
			</el-form-item>
			<el-form-item class="durationWrap" label="通话长度" v-if="haveCallLog">
				<div class="duration">
					<el-slider
						:format-tooltip="v => `${v} s`"
						:max="MSG_DICT.$CallLog.duration[1]"
						:min="MSG_DICT.$CallLog.duration[0]"
						range
						v-model="searchForm.$CallLog.duration"
					></el-slider>
				</div>
			</el-form-item>
			<el-form-item label="设备">
				<el-checkbox-group class="device" v-model="searchForm.device">
					<el-checkbox :key="v" :label="v" class="item" v-for="v in MSG_DICT.device">
						<img :src="`./static/icon/device/${v}.png`" class="icon" />
						<span class="text">{{ v }}</span>
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="消息对象">
				<el-checkbox-group class="device" v-model="searchForm.direction">
					<el-checkbox :key="v" :label="v" class="item" v-for="v in MSG_DICT.direction">
						<span class="text">{{ mapDirection(v).label }}</span>
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="发送人">
				<div :key="v.label" class="sendAndReceive" v-for="v in MSG_DICT.send">
					<div class="group">
						<el-checkbox
							:indeterminate="sendAllValue[v.label].isIndeterminate"
							:value="sendAllValue[v.label].check"
							@change="clickAllSendOrReceive('send', v)"
						>
							<img :src="v.icon" class="icon" v-if="v.icon" />
							<b>{{ v.label }}</b>
						</el-checkbox>
					</div>
					<div class="children">
						<el-checkbox-group v-model="searchForm.send">
							<el-checkbox :key="i" :label="c" class="item" v-for="(c, i) in v.children">
								<span class="text">{{ `${c.senderName}(${c.sender})` }}</span>
							</el-checkbox>
						</el-checkbox-group>
					</div>
				</div>
			</el-form-item>
			<el-form-item label="收件人">
				<div :key="v.label" class="sendAndReceive" v-for="v in MSG_DICT.receive">
					<div class="group">
						<el-checkbox
							:indeterminate="receiveAllValue[v.label].isIndeterminate"
							:value="receiveAllValue[v.label].check"
							@change="clickAllSendOrReceive('receive', v)"
						>
							<img :src="v.icon" class="icon" v-if="v.icon" />
							<b>{{ v.label }}</b>
						</el-checkbox>
					</div>
					<div class="children">
						<el-checkbox-group v-model="searchForm.receive">
							<el-checkbox :key="i" :label="c" class="item" v-for="(c, i) in v.children">
								<span class="text">{{ `${c.receiverName}(${c.receiver})` }}</span>
							</el-checkbox>
						</el-checkbox-group>
					</div>
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import _ from 'lodash';

export default {
	inject: ['localSearch'],
	data: () => ({}),
	computed: {
		searchForm: {
			get() {
				return this.localSearch.form;
			},
			set(v) {
				// 这里应该不起作用，因为都是修改的 searchForm 的属性，而不是赋值给searchForm
				this.localSearch.form = v;
			},
		},
		MSG_DICT() {
			return this.$store.state.query.search.MSG_DICT;
		},
		haveCallLog() {
			const _sType = this.localSearch.form.type;
			const sType = Object.keys(_sType).reduce((pre, tKey, cI, arr) => {
				pre = pre.concat(_sType[tKey].map(t => ({ source: tKey, type: t })));
				return pre;
			}, []);
			return sType.some(v => v.source === 'CallLog');
		},
		sourceAllValue() {
			const sType = this.searchForm.type;
			const sObj = this.MSG_DICT.source.reduce((pre, s) => {
				const obj = { check: false, isIndeterminate: false };
				const fullType = s.type;
				const curType = sType[s.label];
				if (curType.length === 0) {
					// 没选
					obj.check = false;
					obj.isIndeterminate = false;
				} else if (curType.length === fullType.length) {
					// 全选
					obj.check = true;
					obj.isIndeterminate = false;
				} else {
					// 半选
					obj.check = true;
					obj.isIndeterminate = true;
				}
				pre[s.label] = obj;
				return pre;
			}, {});
			return sObj;
		},
		sendAllValue() {
			return this.makeSendOrReceiveState('send');
		},
		receiveAllValue() {
			return this.makeSendOrReceiveState('receive');
		},
	},
	methods: {
		clickAllSource(s) {
			const { check, isIndeterminate } = this.sourceAllValue[s.label];
			const fullType = s.type;
			if (check && !isIndeterminate) {
				this.searchForm.type[s.label] = [];
			} else {
				this.searchForm.type[s.label] = [...fullType];
			}
		},
		clickAllSendOrReceive(type, v) {
			const state = type === 'send' ? this.sendAllValue[v.label] : this.receiveAllValue[v.label];
			const { check, isIndeterminate } = state;
			const fullType = v.children;
			if (check && !isIndeterminate) {
				const emptyThisLabel = _.pullAllWith(this.searchForm[type], fullType, _.isEqual);
				this.searchForm[type] = [...emptyThisLabel];
			} else {
				const fullThisLabel = _.unionWith(this.searchForm[type], fullType, _.isEqual);
				this.searchForm[type] = [...fullThisLabel];
			}
		},
		makeSendOrReceiveState(type) {
			const formArr = this.searchForm[type];
			return this.MSG_DICT[type].reduce((pre, cV) => {
				const obj = { check: false, isIndeterminate: false };
				const fullSelect = cV.children;
				const currSelect = _.intersectionWith(formArr, fullSelect, _.isEqual);
				if (currSelect.length === 0) {
					// 没选
					obj.check = false;
					obj.isIndeterminate = false;
				} else if (currSelect.length === fullSelect.length) {
					// 全选
					obj.check = true;
					obj.isIndeterminate = false;
				} else {
					// 半选
					obj.check = true;
					obj.isIndeterminate = true;
				}
				pre[cV.label] = obj;
				return pre;
			}, {});
		},
		mapDirection(d) {
			switch (d) {
				case 'go':
					return { label: '发送人(聊天窗口右边)', value: d, tips: '右边' };
				case 'come':
					return { label: '接收人(聊天窗口左边)', value: d, tips: '左边' };
				default:
					throw new Error('unknown Direction');
			}
		},
	},
};
</script>
<style lang="sass" scoped>
.filter
    .icon
        width: 16px
        height: 16px
        margin-right: 5px
        vertical-align: text-top
        object-fit: contain
    .sourceAndType
        display: flex
        .source
            flex: 0 0 150px
        .type
            flex: 1 1 auto
            .item
                margin-right: 0
                min-width: 120px
    .duration
        // width: 200px
        margin: 0 20px
    .sendAndReceive
        margin-bottom: 10px
        .children
            line-height: 1em
            padding-left: 25px
</style>