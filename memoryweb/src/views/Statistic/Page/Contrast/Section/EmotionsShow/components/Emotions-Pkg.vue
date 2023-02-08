<template>
    <LoadingDiv class="emotionsPackName">
        <totalTitle>
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
        <el-table :data="pageData" stripe highlight-current-row :height="tableHeight" class="table">
            <tableColumnIndex :currentPage="currentPage" :pageSize="pageSize" />
            <tableColumnPackName />
            <el-table-column label="表情数量" header-align="center" width="70px" align="right">
                <template #default="{ row }">
                    <span style="color: #99a9bf">{{ row.desList.length }}</span>
                </template>
            </el-table-column>

            <tableColumnCount />

            <el-table-column label="表情" header-align="center">
                <template #header>
                    <el-input v-model.trim="searchPackName" placeholder="输入 表情包名称 搜索" clearable />
                </template>
                <template #default="{ row }">
                    <el-scrollbar class="scrollbar">
                        <div class="blockWrap">
                            <div class="block" v-for="d in arrSlice(row.desList)" :key="d.des">
                                <div class="count" :title="`${d.p}%`">{{ d.count }}</div>
                                <el-tooltip>
                                    <div slot="content" class="emotionTip">
                                        <div>一共使用 {{ d.count }} 次 占比 {{ d.p }}%</div>
                                        <div>内含 {{ d.files.length }} 个类似表情</div>
                                        <div class="emotionWrap">
                                            <imgBox :src="e.url" v-for="(e, i) in d.files" :key="i" />
                                        </div>
                                    </div>

                                    <imgBox :src="d.files[0].url" />
                                </el-tooltip>
                                <div class="des">{{ d.des }}</div>
                            </div>
                            <div class="block more" v-if="row.desList.length > MAX_SHOW_EMOTION">
                                <el-tooltip
                                    effect="light"
                                    :content="`还有 ${row.desList.length - MAX_SHOW_EMOTION} 个表情未显示`"
                                >
                                    <div class="icon el-icon-more-outline" @click="showPkg(row)"></div>
                                </el-tooltip>
                            </div>
                        </div>
                    </el-scrollbar>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="65px">
                <template #default="{ row }">
                    <el-button icon="el-icon-full-screen" @click="showPkg(row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                :current-page.sync="currentPage"
                :page-sizes="[5, 10, 20, 50, 100, 200, 300, 400, 500]"
                :page-size.sync="pageSize"
                :total="filterData.length"
                layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
        </div>

        <el-dialog :title="dialog.title" center :visible.sync="dialog.visible" fullscreen class="EmotionsDesDialog">
            <EmotionsDesTable
                :data="dialog.desData"
                :tableWrapHeight="'calc( 100vh - 54px - 32px)'"
                :defaultPageSize="7"
                :showTitle="false"
            />
            <!-- // dialogHeader bodyPadding paginationHeight -->
        </el-dialog>
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
    name: 'Page-Statistic-Contrast-Components-emotion-Pkg',
    props: {
        data: {
            type: Object,
            default: () => ({
                count: 0,
                packList: [],
            }),
        },
        tableHeight: {
            type: [Number, String],
            default: '100%',
        },
    },
    data: () => ({
        DEFAULT_AVATAR_COME,
        DEFAULT_AVATAR_GO,

        MAX_SHOW_EMOTION: 20,
        currentPage: 1,
        pageSize: 5,
        searchPackName: '',
        dialog: {
            visible: false,
            title: '',
            desData: {
                count: 0,
                desList: [],
            },
        },
    }),
    computed: {
        filterData() {
            const s = this.searchPackName;
            const arr = this.data.packList;

            return s ? arr.filter(v => v.packName.includes(s)) : arr;
        },
        pageData() {
            const p = this.currentPage - 1;
            const s = p * this.pageSize;
            const e = p * this.pageSize + this.pageSize;

            return this.filterData.slice(s, e);
        },
    },
    watch: {
        'searchPackName'() {
            this.currentPage = 1;
        },
        'data.packList.length'() {
            this.currentPage = 1;
        },
    },
    methods: {
        showPkg(row) {
            // eslint-disable-next-line no-unused-vars
            const { packName, count, desList, p } = row;
            this.dialog.title = `排名 ${row.index} - ${packName} - 使用 ${count} 次 - 占比 ${p}%`;
            this.dialog.visible = true;
            this.dialog.desData = row;
        },
        arrSlice(arr) {
            return arr.slice(0, this.MAX_SHOW_EMOTION);
        },
    },
    components: {
        imgBox,
        totalTitle,
        EmotionsDesTable: () => import('./Emotions-Des.vue'),
        tableColumnIndex,
        tableColumnPackName,
        tableColumnCount,
    },
};
</script>
<style lang="sass" scoped>
.emotionsPackName
    min-height: 300px
    .table
        .scrollbar
            height: 100%
            width: 100%
            ::v-deep .el-scrollbar__wrap
                width: 100%
                height: 100%
                overflow-y: hidden
                overflow-x: scroll
            .blockWrap
                white-space: nowrap
                display: flex
                .block
                    padding-right: 5px
                    display: flex
                    flex-direction: column
                    justify-content: space-between
                    text-align: center
                    align-items: center
                    &.more
                        justify-content: center
                        font-size: 20px
                        .icon
                            cursor: pointer
    .pagination
        text-align: right
        width: 100%

.emotionTip
    text-align: center
    .emotionWrap
        text-align: center
.EmotionsDesDialog
    ::v-deep
        .el-dialog__body
            padding: 0 20px
</style>
