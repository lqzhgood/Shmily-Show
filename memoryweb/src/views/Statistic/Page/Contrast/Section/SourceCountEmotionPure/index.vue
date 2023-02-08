<template>
    <SourceCount :sourceType="sourceType" :url="url" :unit="'条'">
        <template #title>
            <span>
                纯表情消息条数
                <TipsQ>
                    <div class="tips">
                        <div>仅统计可和表情混合发送的消息</div>
                        <div>例如 Wechat 点击表情会直接发送,不可与消息混合发送,此类型不参与统计</div>
                        <el-divider>
                            <span style="font-size: 12px">*T 仅包含以下类型</span>
                        </el-divider>
                        <div class="types">
                            <img src="/static/icon/source/Wechat-消息.png" title="Wechat-消息" class="icon" />
                            <img src="/static/icon/source/QQ-消息.png" title="QQ-消息" class="icon" />
                            <img src="/static/icon/source/MobileQQ-消息.png" title="MobileQQ-消息" class="icon" />
                            <img
                                src="/static/icon/source/MobileQQ-自定义表情.png"
                                title="MobileQQ-自定义表情(仅混合消息)"
                                class="icon"
                            />
                        </div>
                        <el-divider><i class="el-icon-pie-chart"></i></el-divider>
                        <el-table :data="tableData" class="table">
                            <el-table-column align="center">
                                <template #default="{ row }">
                                    <img
                                        class="avatar"
                                        :src="DEFAULT_AVATAR_COME"
                                        v-if="[DIRECTION_TYPE_ALL, DIRECTION_TYPE_COME].includes(row.type)"
                                    />
                                    <img
                                        class="avatar"
                                        :src="DEFAULT_AVATAR_GO"
                                        v-if="[DIRECTION_TYPE_ALL, DIRECTION_TYPE_GO].includes(row.type)"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                label="纯表情数量"
                                prop="count"
                                min-width="65px"
                            ></el-table-column>
                            <el-table-column label="*T 参与统计消息" align="center">
                                <el-table-column prop="part.total" label="消息总数" align="right"></el-table-column>
                                <el-table-column
                                    align="right"
                                    label="百分比"
                                    prop="part.percent"
                                    :formatter="(row, column, cellValue) => cellValue + '%'"
                                ></el-table-column>
                            </el-table-column>
                            <el-table-column label="个人发送消息" align="center">
                                <el-table-column prop="all.total" label="消息总数" align="right"></el-table-column>
                                <el-table-column
                                    align="right"
                                    label="百分比"
                                    prop="all.percent"
                                    :formatter="(row, column, cellValue) => cellValue + '%'"
                                ></el-table-column>
                            </el-table-column>
                            <el-table-column
                                align="right"
                                label="全部消息占比"
                                header-align="center"
                                prop="allPercent"
                                :formatter="(row, column, cellValue) => cellValue + '%'"
                            ></el-table-column>
                        </el-table>
                    </div>
                </TipsQ>
            </span>
        </template>
    </SourceCount>
</template>
<script>
import axiosJson from '@/plugins/axios-json';

import TipsQ from '@/components/Tips/Q.vue';
import SourceCount from '../../../../components/Plot/SourceCount/index.vue';
import {
    SOURCE_TYPE_CONTRAST,
    DEFAULT_AVATAR_COME,
    DEFAULT_AVATAR_GO,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
} from '../../../../const.js';

export default {
    name: 'Statistic-Contrast-Section-SourceCount-Emotion-Pure',
    async created() {
        this.tableData = await axiosJson.get(
            `/statistic/${this.sourceType}/${DIRECTION_TYPE_ALL}/emotion-pure/count-msg-length.json`,
        );
    },
    data: () => ({
        tableType: 'all',
        tableData: [
            {
                type: DIRECTION_TYPE_ALL,
                count: '-',
                all: { total: '-', percent: '-' },
                part: { total: '-', percent: '-' },
                allPercent: '-',
            },
            {
                type: DIRECTION_TYPE_COME,
                count: '-',
                all: { total: '-', percent: '-' },
                part: { total: '-', percent: '-' },
                allPercent: '-',
            },
            {
                type: DIRECTION_TYPE_GO,
                count: '-',
                all: { total: '-', percent: '-' },
                part: { total: '-', percent: '-' },
                allPercent: '-',
            },
        ],
        sourceType: SOURCE_TYPE_CONTRAST,
        DEFAULT_AVATAR_COME,
        DEFAULT_AVATAR_GO,
        DIRECTION_TYPE_ALL,
        DIRECTION_TYPE_COME,
        DIRECTION_TYPE_GO,
    }),
    computed: {
        url() {
            return `/statistic/${this.sourceType}/${DIRECTION_TYPE_ALL}/emotion-pure/sourceCount.json`;
        },
    },
    components: {
        SourceCount,
        TipsQ,
    },
};
</script>
<style lang="sass" scoped>
.tips
    line-height: 1.5
    .types
        display: flex
        align-items: center
        justify-content: space-evenly
        .icon
            width: 20px
            height: 20px
            object-fit: contain
    ::v-deep
        .el-divider
            margin: 15px 0
    .table
        width: 100%
        .avatar
            width: 14px
            height: 14px
            vertical-align: middle 
</style>
