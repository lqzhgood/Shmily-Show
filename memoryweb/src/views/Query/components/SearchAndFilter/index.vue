<template>
	<el-dialog
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:show-close="false"
		:visible.sync="showSearchAndFilter"
		custom-class="SearchAndFilterDialog"
		fullscreen
	>
		<div class="title" slot="title">
			<div class="text">搜索与筛选</div>
			<div class="btns">
				<el-button :loading="searchLoading" @click="confirm()" icon="el-icon-check" plain title="应用筛选" type="success"></el-button>
				<el-button :loading="searchLoading" @click="close()" icon="el-icon-close" plain title="取消" type="danger"></el-button>
			</div>
		</div>
		<div class="main">
			<el-card
				class="wrapFilter"
				element-loading-spinner="el-icon-warning-outline"
				element-loading-text="评论不可按分类搜索"
				shadow="hover"
				v-loading="filterIsNotValid"
			>
				<el-scrollbar class="noX filterScroll">
					<FilterPad />
				</el-scrollbar>
			</el-card>
			<div class="noX wrapSearch">
				<SearchPad ref="SearchPad" />
			</div>
		</div>
	</el-dialog>
</template>
<script>
import _ from 'lodash';
import { CONST_SEARCH_TYPE_COMMENT } from '@/utils/const.js';

import SearchPad from './components/SearchPad';
import FilterPad from './components/FilterPad';

export default {
	name: 'Query-SearchAndFilter',
	provide() {
		return {
			localSearch: this.localSearch,
		};
	},
	mounted() {
		const { searchKey, searchForm, searchType } = this.$store.state.query.search;

		// 从 $store 获取最新的深拷贝，避免更新 $store 的时候更新到整个列表
		this.localSearch.type = searchType;
		this.localSearch.key = searchKey;
		const localSearchForm = _.cloneDeep(searchForm);
		this.fixObjectAddressFromDICT(localSearchForm, 'send');
		this.fixObjectAddressFromDICT(localSearchForm, 'receive');
		this.localSearch.form = localSearchForm;
	},
	data: () => ({
		localSearch: {
			type: '',
			key: '',
			form: null,
		},
	}),
	computed: {
		searchLoading() {
			return this.$store.state.query.search.loading;
		},
		filterIsNotValid() {
			return this.localSearch.type === CONST_SEARCH_TYPE_COMMENT;
		},
		showSearchAndFilter: {
			get() {
				return this.$store.state.query.search.showSearchAndFilter;
			},
			set(on_off) {
				this.$store.commit('query/search/toggleShowSearchAndFilter', on_off);
			},
		},
		MSG_DICT() {
			return this.$store.state.query.search.MSG_DICT;
		},
		MSG_DICT_ALL_SEND() {
			return this.MSG_DICT.send.reduce((pre, cV) => {
				return pre.concat(cV.children);
			}, []);
		},
		MSG_DICT_ALL_RECEIVE() {
			return this.MSG_DICT.receive.reduce((pre, cV) => {
				return pre.concat(cV.children);
			}, []);
		},
	},
	methods: {
		/**
		 * @name: fixObjectAddressFromDICT
		 * @description:  后面 checkbox-group v-model searchForm[type] 数组中绑定的是 Object
		 *                手动赋值过去的 Object _.isEqual 相等，但是地址不相等，会造成 v-model 双向绑定失效
		 *                 所以需要在这里手动清洗 Object 为原始 DICT 里面的 ‘相同’ Object
		 * @param {*} form
		 * @param {*} type
		 * @return {*}
		 */
		fixObjectAddressFromDICT(form, type) {
			const clone = form[type];
			for (let i = 0; i < clone.length; i++) {
				const clone_t = clone[i];
				const tt = this[`MSG_DICT_ALL_${type.toUpperCase()}`].find(t => _.isEqual(t, clone_t));
				if (!tt) console.warn('错误的引入', tt);
				if (tt !== clone_t) clone.splice(i, 1, tt);
			}
		},
		async confirm() {
			await this.$store.dispatch('query/search/sendSearch', { search: this.localSearch });
			this.close();
		},
		close() {
			this.showSearchAndFilter = false;
		},
	},
	components: {
		SearchPad,
		FilterPad,
	},
};
</script>
<style lang="sass">
.SearchAndFilterDialog
    .el-dialog__body
        padding: 0
</style>
<style lang="sass" scoped>
.title
    display: flex
    .text
        flex: 1 1 auto
.main
    display: flex
    justify-content: space-between
    .wrapFilter,.wrapSearch
        height: calc(100vh - 60px) !important
        flex: 0 1 50%
        display: flex
        align-items: stretch
        box-sizing: border-box
    .wrapFilter
        margin-right: 5px //中间间隔 10px
        ::v-deep
            > .el-card__body
                width: 100%
                box-sizing: border-box
        .filterScroll
            height: 100%
    .wrapSearch
        margin-left: 5px //中间间隔 10px
</style>