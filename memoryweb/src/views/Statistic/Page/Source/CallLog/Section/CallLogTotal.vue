<template>
    <CardWrap v-loading="loading">
        <div slot="header" class="header">
            <el-tooltip :content="`${db.total * 1000} 秒`">
                <span>总时长: {{ timeHumanize(db.total) }}</span>
            </el-tooltip>
            <el-tooltip>
                <div slot="content">
                    <span v-for="d in db.maxDays" :key="d">{{ d }}</span>
                </div>
                <span style="float: right">当天最高累计: {{ timeHumanize(db.max) }}</span>
            </el-tooltip>
        </div>

        <el-row :gutter="30" class="detail" type="flex" v-for="v in db.type" :key="v.source">
            <el-col :span="3" class="col source">
                <img :src="avatar(v.source)" class="avatar" />
                <b>{{ v.source }}</b>
            </el-col>
            <el-col :span="6" :offset="1" class="col num">
                <div class="label">总时长</div>
                <div class="value">
                    <el-tooltip :content="`${v.count} 秒`">
                        <span>{{ timeHumanize(v.count) }}</span>
                        <span class="percent">{{ v.percent }} %</span>
                    </el-tooltip>
                </div>
            </el-col>
            <el-col :span="6" :offset="1" class="col maxRecord">
                <div class="label">最高单次:</div>
                <div class="value">
                    <el-tooltip>
                        <div slot="content">
                            <span v-for="d in v.maxRecordDays" :key="d">{{ d }}</span>
                        </div>
                        <span>{{ timeHumanize(v.maxRecord) }}</span>
                    </el-tooltip>
                </div>
            </el-col>
            <el-col :span="6" :offset="1" class="col maxDays">
                <div class="label">最高当天:</div>
                <div class="value">
                    <el-tooltip>
                        <div slot="content">
                            <span v-for="d in v.maxDays" :key="d">{{ d }}</span>
                        </div>
                        <span>{{ timeHumanize(v.max) }}</span>
                    </el-tooltip>
                </div>
            </el-col>
        </el-row>
    </CardWrap>
</template>
<script>
import axiosJson from '@/plugins/axios-json';
import { deepFreeze } from '@/utils/index';
import humanizeDuration from 'humanize-duration';
const { KEY_ALL, DEFAULT_AVATAR_GO, DEFAULT_AVATAR_COME, DIRECTION_TYPE_ALL } = require('@/views/Statistic/const.js');

export default {
    name: 'Page-Statistic-Source-CallLog-Components-Total',
    async mounted() {
        const db = await axiosJson(`/statistic/${this.sourceType}/${DIRECTION_TYPE_ALL}/timeLine-duration/total.json`);
        this.db = deepFreeze(db);
        this.loading = false;
    },
    props: {
        sourceType: { type: String, required: true },
    },
    data: () => ({
        db: {
            total: 0,
            type: [],
        },
        loading: true,
    }),
    computed: {
        sourceDetail() {
            return this.db.type.filter(v => v.source !== KEY_ALL);
        },
    },
    methods: {
        timeHumanize(s) {
            const DELIMITER = ' ';
            const str = humanizeDuration(s * 1000, { language: 'zh_CN', delimiter: DELIMITER });
            // 补 0 对齐
            const reg = new RegExp(`(?<=[天|小时|分钟]${DELIMITER})(\\d{1})(?=${DELIMITER})`, 'g');
            return str.replace(reg, t => t.padStart(2, '0'));
        },
        avatar(direction) {
            return direction === '主叫' ? DEFAULT_AVATAR_GO : DEFAULT_AVATAR_COME;
        },
    },
};
</script>
<style lang="sass" scoped>
.header
    font-size: 14px
.detail
    font-size: 14px
    line-height: 20px
    padding: 0 50px
    margin-bottom: 10px
    &:last-child
        margin-bottom: 0
    .col
        display: flex
        align-items: center
        .label
            flex: 0 0 auto
            color: #99a9bf
        .value
            flex: 1 1  auto
    .source
        .avatar
            margin-right: 20px
            max-width: 16px
            max-height: 16px
            vertical-align: middle
    .num
        text-align: right
        .percent
            margin-left: 20px
    .maxRecord
        text-align: right
    .maxDays
        text-align: right
</style>
