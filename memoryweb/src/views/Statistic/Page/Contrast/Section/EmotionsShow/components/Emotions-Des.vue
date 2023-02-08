<template>
    <LoadingDiv class="emotionsDes">
        <totalTitle v-if="showTitle">
            <slot name="title">
                <img class="avatar" :src="DEFAULT_AVATAR_COME" style="margin-right: 0" />
                <img class="avatar" :src="DEFAULT_AVATAR_GO" />

                <span class="label">表情包数量:</span>
                <span class="count">{{ data.packCount }}</span>

                <span class="label">表情数量:</span>
                <span class="count">{{ data.desCount }}</span>

                <span class="label">文件数量:</span>
                <span class="count">{{ data.emotionCount }}</span>
            </slot>
        </totalTitle>
        <div class="tableWrap" :style="{ height: tableWrapHeight }">
            <el-table :data="pageData" stripe highlight-current-row class="table" :height="tableHeight">
                <tableColumnIndex :currentPage="currentPage" :pageSize="pageSize" />
                <tableColumnPackName />
                <el-table-column prop="des" label="描述" align="center" width="80px"></el-table-column>
                <tableColumnCount />
                <el-table-column label="表情">
                    <template #header>
                        <el-input v-model.trim="searchDes" placeholder="输入 表情描述 搜索" clearable />
                    </template>

                    <template #default="{ row }">
                        <div class="block" v-for="(e, i) in row.files" :key="i">
                            <div class="count" :title="`${e.p}%`">{{ e.count }}</div>
                            <imgBox :src="e.url" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination
                :current-page.sync="currentPage"
                :page-sizes="[5, 7, 10, 20, 50, 100, 200, 300, 400, 500]"
                :page-size.sync="pageSize"
                :total="filterData.length"
                layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
        </div>
    </LoadingDiv>
</template>
<script>
import imgBox from './imgBox.vue';
import totalTitle from './totalTitle.vue';

import tableColumnIndex from './tableColumn/index.vue';
import tableColumnPackName from './tableColumn/packName.vue';
import tableColumnCount from './tableColumn/count.vue';

import { DEFAULT_AVATAR_COME, DEFAULT_AVATAR_GO } from '@/views/Statistic/const.js';

export default {
    name: 'Page-Statistic-Contrast-Components-emotion-Des',
    props: {
        showTitle: {
            type: Boolean,
            default: true,
        },
        data: {
            type: Object,
            default: () => ({
                count: 0,
                desList: [],
            }),
        },
        defaultPageSize: {
            type: Number,
        },
        tableWrapHeight: {
            type: [Number, String],
            default: '100%',
        },
        tableHeight: {
            type: [Number, String],
            default: '100%',
        },
    },
    mounted() {
        if (this.defaultPageSize) {
            this.pageSize = this.defaultPageSize;
        }
    },
    data: () => ({
        DEFAULT_AVATAR_COME,
        DEFAULT_AVATAR_GO,

        currentPage: 1,
        pageSize: 5,
        searchDes: '',
    }),
    computed: {
        filterData() {
            const s = this.searchDes;
            const arr = this.data.desList;
            return s ? arr.filter(v => v.des.includes(s)) : arr;
        },
        pageData() {
            const p = this.currentPage - 1;
            const s = p * this.pageSize;
            const e = p * this.pageSize + this.pageSize;
            return this.filterData.slice(s, e);
        },
    },
    watch: {
        'data.desList.length'() {
            this.currentPage = 1;
        },
    },
    components: {
        imgBox,
        totalTitle,
        tableColumnIndex,
        tableColumnPackName,
        tableColumnCount,
    },
};
</script>
<style lang="sass" scoped>
.emotionsDes
    min-height: 300px
    .tableWrap
         .block
            text-align: center
            display: inline-block
    .pagination
        text-align: right
        width: 100%
</style>
