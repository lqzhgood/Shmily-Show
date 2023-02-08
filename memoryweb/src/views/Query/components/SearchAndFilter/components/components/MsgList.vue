<template>
    <tableWrap :filterData="filterData" :type="type" class="tableWrap" ref="tableWrap">
        <template #expand>
            <el-table-column :key="0" type="expand">
                <template #default="{ row }">
                    <el-form class="innerForm" label-width="60px">
                        <el-form-item label="序号">
                            <span>
                                第 {{ row.index + 1 }} 条
                                <i @click="log(row)" class="el-icon-coin btn" title="F12 打印详细"></i>
                            </span>
                        </el-form-item>
                        <el-form-item label="ID">
                            <span>
                                {{ row.id }}
                                <i @click="copyText(row.id)" class="el-icon-document-copy btn"></i>
                            </span>
                        </el-form-item>

                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="设备">
                                    <img :src="`./static/icon/device/${row.device}.png`" class="icon" />
                                    <span>{{ row.device }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="来源">
                                    <img :src="`./static/icon/source/${row.source}-${row.type}.png`" class="icon" />
                                    <span class="text">{{ row.source }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="类型">
                                    <img :src="`./static/icon/type/${row.source}-${row.type}.png`" class="icon" />
                                    <span class="text">{{ row.type }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-form-item label="送达">
                            <div>
                                <span>{{ row.senderName }}({{ row.sender }})</span>
                                <span style="margin: 0 10px">{{ `→` }}</span>
                                <span>{{ row.receiverName }}({{ row.receiver }})</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="纯文本">
                            <div :inner-html.prop="row.content | Highlight(keyArrByType)"></div>
                        </el-form-item>
                        <el-form-item class="Rich" label="富文本">
                            <!-- <div :inner-html.prop="row.html" class="html"></div> -->
                            <el-card class="msgInner" shadow="hover">
                                <MsgInner :msg="row" />
                            </el-card>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
        </template>

        <el-table-column :key="2" header-align="center" label="来源" width="100px">
            <template #default="{ row }">
                <img :src="`./static/icon/source/${row.source}-${row.type}.png`" class="icon" />
                <span>{{ row.source }}</span>
            </template>
        </el-table-column>
        <el-table-column :key="3" align="center" header-align="center" label="日期" width="140px">
            <template #default="{ row }">
                <span>{{ row.day }} {{ row.time }}</span>
            </template>
        </el-table-column>
        <el-table-column :key="4" align="center" header-align="center" width="40px">
            <template #default="{ row }">
                <span>{{ row.direction === 'go' ? '←' : '→' }}</span>
            </template>
        </el-table-column>
        <el-table-column :key="5" header-align="center" label="文本内容" prop="content" resizable show-overflow-tooltip>
            <template #default="{ row }">
                <div :inner-html.prop="row.content | Highlight(keyArrByType)" class="contentWrap"></div>
            </template>
        </el-table-column>
    </tableWrap>
</template>
<script>
import { CONST_SEARCH_TYPE_MSG } from '@/utils/const.js';

import tableWrap from './components/tableWrap';
import mix from './components/mix.js';

import MsgInner from '@/components/Msg/components/MsgInner.vue';

import { searchHandler, makeCanSearchArr } from '../../utils';

export default {
    mixins: [mix],
    name: 'Query-MsgList',
    data: () => ({
        type: CONST_SEARCH_TYPE_MSG,
    }),
    computed: {
        canSearchArr() {
            const arr = this.msgAll;
            return makeCanSearchArr(this.type, arr);
        },
    },
    methods: {
        searchHandler() {
            this.filterData = searchHandler(this.canSearchArr, this.localSearch, {
                keyArrByType: this.keyArrByType,
            });
        },
    },
    components: {
        tableWrap,
        MsgInner,
    },
};
</script>
<style lang="sass" scoped>
@import './components/style'
.tableWrap
    @include Table
    .innerForm
        .Rich
            .msgInner
                display: inline-block
                ::v-deep
                    > .el-card__body
                        padding: 0
</style>
