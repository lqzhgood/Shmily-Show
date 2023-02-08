<template>
	<div class="tableWrap">
		<el-scrollbar class="noX scrollbar" ref="scroll">
			<el-table
				:data="filterDataPaging"
				:expand-row-keys="expandKeys"
				:lazy="true"
				:row-class-name="ExpandClass()"
				:show-header="false"
				:stripe="!rowExpansion"
				class="table"
				ref="table"
				row-key="index"
			>
				<slot name="expand"></slot>
				<el-table-column :key="1" align="center" label="#" width="60px">
					<template #default="{$index}">{{(currentPage-1)*pageSize+$index+1}}</template>
				</el-table-column>
				<slot></slot>
				<el-table-column :key="999" align="right" width="40px">
					<template #default="{row}">
						<span
							:title="`点击跳转到本条消息\n按 Shift 点击跳转到过滤消息\n按 Ctrl 点击后台打开`"
							@click.ctrl="openWinQueryById(row)"
							@click.exact="goToMsg(row)"
							@click.shift="goToFilterMsg(row)"
							class="goToDay"
						>🚀</span>
					</template>
				</el-table-column>
			</el-table>
		</el-scrollbar>

		<div class="pagination">
			<el-pagination
				:current-page.sync="currentPage"
				:page-size.sync="pageSize"
				:page-sizes="[10,20, 50, 100, 200,300,400,500]"
				:total="total"
				@current-change="$store.commit('query/search/toggleRowExpansion',false)"
				layout="total, sizes, prev, pager, next, jumper"
				small
			></el-pagination>
		</div>
	</div>
</template>
<script>
import { openWinQueryById } from '@/utils/index.js';
import { CONST_SEARCH_TYPE_MSG, CONST_SEARCH_TYPE_COMMENT } from '@/utils/const.js';

export default {
	name: 'Query-SearchAndFilter-Components-tableWrap',
	inject: ['localSearch'],
	props: {
		type: {
			type: String,
			require: true,
			validator(v) {
				return [CONST_SEARCH_TYPE_MSG, CONST_SEARCH_TYPE_COMMENT].includes(v);
			},
		},
		filterData: {
			type: Array,
			require: true,
		},
	},
	data: () => ({
		expandKeys: [],
	}),
	computed: {
		currentPage: {
			get() {
				return this.$store.state.query.search.currentPage;
			},
			set(v) {
				this.$store.commit('query/search/setCurrentPage', v);
			},
		},
		pageSize: {
			get() {
				return this.$store.state.query.search.pageSize;
			},
			set(v) {
				this.$store.commit('query/search/setPageSize', v);
			},
		},
		rowExpansion() {
			return this.$store.state.query.search.rowExpansion;
		},
		filterDataPaging() {
			const p = this.currentPage - 1;
			const s = p * this.pageSize;
			const e = p * this.pageSize + this.pageSize;
			return this.filterData.slice(s, e);
		},
		total() {
			return this.filterData.length;
		},
	},
	watch: {
		rowExpansion(v) {
			this.expandKeys = v ? this.filterDataPaging.map(m => m.index) : [];
		},
		filterDataPaging() {
			this.$nextTick(() => {
				this.$store.commit('query/search/setLoading', false);
				this.$refs.scroll.wrap.scrollTop = 0;
			});
		},
	},
	methods: {
		async goToMsg(v) {
			let id;
			if (this.type === CONST_SEARCH_TYPE_COMMENT) {
				id = v.msgId;
			} else {
				id = v.id;
			}
			await this.$store.dispatch('query/search/sendSearch', { search: {}, id });

			await this.$nextTick();
			this.$store.commit('query/search/toggleShowSearchAndFilter', false);
		},
		async goToFilterMsg(v) {
			let id;
			if (this.type === CONST_SEARCH_TYPE_COMMENT) {
				id = v.msgId;
			} else {
				id = v.id;
			}
			await this.$store.dispatch('query/search/sendSearch', { search: this.localSearch, id });
			await this.$nextTick();
			this.$store.commit('query/search/toggleShowSearchAndFilter', false);
		},
		openWinQueryById(v) {
			const id = this.type === CONST_SEARCH_TYPE_COMMENT ? v.msgId : v.id;
			openWinQueryById(id);
		},
		ExpandClass() {
			return this.rowExpansion ? 'rowExpansion' : null;
		},
		resetPage() {
			this.currentPage = 1;
		},
	},
};
</script>
<style lang="sass" scoped>
.tableWrap
    display: flex
    flex-direction: column
    height: calc( 100% - 50px - 54px )
    .scrollbar
        flex: 1 1 auto
    .goToDay
        cursor: pointer
    .pagination
        text-align: right
        width: 100%
    ::v-deep
        .rowExpansion
            background-color: #e9eef3 !important
            color: #333 !important
</style>