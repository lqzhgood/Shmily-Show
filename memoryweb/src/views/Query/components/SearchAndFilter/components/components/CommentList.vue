<template>
    <tableWrap :filterData="filterData" :type="type" class="tableWrap" ref="tableWrap">
        <template #expand>
            <el-table-column :key="0" type="expand">
                <template #default="{ row }">
                    <el-form class="innerForm" label-width="60px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="评论序号">
                                    <!-- 总是从0开始 未计算截取前的数量 -->
                                    <span>第 {{ row.index + 1 }} 条</span>
                                    <i @click="log(row)" class="el-icon-coin btn" title="F12 打印详细"></i>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="消息序号">
                                    <span>第 {{ row.msgIndex }} 条</span>
                                    <i @click="log(getMsg(row))" class="el-icon-coin btn" title="F12 打印详细"></i>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-form-item label="msgID">
                            <span>
                                {{ row.msgId }}
                                <i @click="copyText(row.msgId)" class="el-icon-document-copy btn"></i>
                            </span>
                        </el-form-item>
                        <el-form-item label="纯文本">
                            <div :inner-html.prop="row.content | Highlight(keyArrByType)"></div>
                        </el-form-item>
                        <el-form-item class="Rich" label="富文本">
                            <el-card class="rickInner" shadow="hover">
                                <div :inner-html.prop="row.html" class="html"></div>
                            </el-card>
                        </el-form-item>
                        {{ row }}
                    </el-form>
                </template>
            </el-table-column>
        </template>

        <el-table-column :key="3" align="center" header-align="center" label="日期" width="140px">
            <template #default="{ row }">
                <span>{{ getMsg(row).day }} {{ getMsg(row).time }}</span>
            </template>
        </el-table-column>
        <el-table-column :key="5" header-align="center" label="文本内容" resizable show-overflow-tooltip>
            <template #default="{ row }">
                <div :inner-html.prop="row.content | Highlight(keyArrByType)" class="contentWrap"></div>
            </template>
        </el-table-column>
    </tableWrap>
</template>
<script>
import { CONST_SEARCH_TYPE_COMMENT } from '@/utils/const.js';

import tableWrap from './components/tableWrap';
import mix from './components/mix.js';

import { searchHandler, makeCanSearchArr } from '../../utils';

export default {
    mixins: [mix],
    name: 'Query-commentList',
    data: () => ({
        type: CONST_SEARCH_TYPE_COMMENT,
    }),
    computed: {
        canSearchArr() {
            const arr = this.$store.state.commentAll;
            return makeCanSearchArr(this.type, arr);
        },
    },
    methods: {
        searchHandler() {
            this.filterData = searchHandler(this.canSearchArr, this.localSearch);
        },
        getMsg(c) {
            return this.msgAll[c.msgIndex];
        },
    },
    components: {
        tableWrap,
    },
};
</script>
<style lang="sass" scoped>
@import './components/style'
@import '@/components/Comment/commentCommon'

.tableWrap
    @include Table
    .innerForm
        .Rich
            .rickInner
                ::v-deep
                    > .el-card__body
                        padding: 5px
            .html
                ::v-deep
                    @include commentHTML
</style>
