<template>
	<el-card class="search" shadow="hover" v-loading="loading">
		<!-- @keypress.native.enter="setKey()" -->

		<el-tooltip effect="dark" placement="top">
			<div slot="content">
				多个关键词使用空格分隔
				<br />-ABC 可以排除 ABC
				<br />-Reg:/ABC/gim 可以使用正则
			</div>
			<el-input
				:class="{'keyChange':keyChange}"
				@keypress.native.enter="setKey()"
				class="inputKey"
				clearable
				placeholder="请输入需要搜索的关键词 区分中英文半全角符号"
				ref="input"
				size="mico"
				style="margin-bottom:10px"
				v-model="inputKey"
			>
				<template slot="prepend" v-if="searchType==='评论' && COMMENT_TAGS.length!==0">
					<el-dropdown placement="bottom" size="mico" split-button>
						<span class="el-dropdown-link">#</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :key="t" @click.native="clickTag(t)" v-for="t in COMMENT_TAGS">{{t}}</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>

				<el-button @click="setKey()" icon="el-icon-search" slot="append" type="primary"></el-button>
			</el-input>
		</el-tooltip>

		<div class="tabsWrap">
			<el-tabs class="tabs" v-model="searchType">
				<el-tab-pane label="消息" name="消息" />
				<el-tab-pane label="评论" name="评论" />
			</el-tabs>
			<div @click="$store.commit('query/search/toggleRowExpansion')" class="actions">
				<i class="el-icon-s-operation" title="全部缩小" v-if="rowExpansion"></i>
				<i class="el-icon-menu" title="全部展开" v-else></i>
			</div>
		</div>
		<MsgList ref="msgList" v-if="searchType === '消息'" />
		<CommentList ref="commentList" v-else-if="searchType === '评论'" />
	</el-card>
</template>
<script>
import _ from 'lodash';

import { COMMENT_TAGS } from '@/config.js';
import { CONST_SEARCH_TYPE_MSG, CONST_SEARCH_TYPE_COMMENT } from '@/utils/const.js';

import MsgList from './components/MsgList';
import CommentList from './components/CommentList';

export default {
	name: 'Query-SearchAndFilter-SearchPad',
	created() {
		this.queryFromRoute();
		this.inputKey = this.localSearch.key;
	},
	inject: ['localSearch'],
	data: () => ({
		inputKey: '',
		COMMENT_TAGS,
	}),
	computed: {
		loading: {
			get() {
				return this.$store.state.query.search.loading;
			},
			set(v) {
				this.$store.commit('query/search/setLoading', v);
			},
		},
		searchKey: {
			get() {
				return this.localSearch.key;
			},
			set(v) {
				this.localSearch.key = v;
			},
		},
		searchType: {
			get() {
				return this.localSearch.type;
			},
			set(v) {
				this.localSearch.type = v;
			},
		},
		keyChange() {
			return this.searchKey != this.inputKey;
		},
		rowExpansion() {
			return this.$store.state.query.search.rowExpansion;
		},
	},
	watch: {
		// 自动输入不太好输入时间 还是手动 enter 吧
		// inputKey: _.debounce(function(v, o) {
		//     if (o.trim() !== v.trim()) this.setKey();
		// }, 1000),
		loading(v) {
			// 搜索时失焦 搜索后聚焦
			this.$nextTick(() => {
				if (v) {
					this.$refs.input.blur();
				} else {
					this.$refs.input.focus();
				}
			});
		},
	},
	methods: {
		queryFromRoute() {
			const { searchType = CONST_SEARCH_TYPE_MSG, searchKey = '' } = this.$route.query;
			if (!searchKey || ![CONST_SEARCH_TYPE_MSG, CONST_SEARCH_TYPE_COMMENT].includes(searchType)) {
				this.setKey();
			} else {
				this.searchKey = searchKey;
				this.searchType = searchType;

				this.$router.replace({ query: _.omit(this.$route.query, ['searchType', 'searchKey']) });
				this.setKey();
			}
		},
		async setKey() {
			this.loading = true;
			await this.$nextTick();
			// 虽然数据没有变化 但是 loading 一下 可以让用户感觉还是计算过心里会好过一点
			if (this.keyChange) {
				this.searchKey = this.inputKey; // 赋值 key 会触发下层 watch localSearch
			} else {
				this.loading = false;
			}
		},
		clickTag(t) {
			if (this.inputKey.includes(t)) return;
			this.inputKey = t + ' ' + this.inputKey;
			this.setKey();
		},
	},
	components: {
		MsgList,
		CommentList,
	},
};
</script>
<style lang="sass" scoped>
.search
    flex: 1 1 auto
    ::v-deep
        > .el-card__body
            padding: 20px 20px 0 20px
            height: calc(100% - 20px)
            display: flex
            flex-direction: column
            .inputKey
                .el-input-group__append
                    transition: all 0.5s
                &.keyChange
                    .el-input-group__append
                        // color: #409eff
                        // background: #ecf5ff
                        // border-color: #b3d8ff
                        color: #fff
                        background-color: #409eff
                        border-color: #409eff
    .tabsWrap
        position: relative
        .actions
            position: absolute
            right: 0
            top: 10px
            font-size: 16px
            cursor: pointer
</style>
