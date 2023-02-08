<template>
    <SourceComment :sourceTypeByComponent="sourceType">
        <template #row3>
            <el-row :gutter="10" class="row" type="flex">
                <el-col :span="24">
                    <CallLog_Total :sourceType="sourceType" />
                </el-col>
            </el-row>
            <el-row :gutter="10" class="row" type="flex">
                <el-col :span="24">
                    <TimeLineDuration />
                </el-col>
            </el-row>
        </template>
    </SourceComment>
</template>
<script>
import AsyncComponent from '@/components/AsyncComponent';

export default {
    name: 'Page-Statistic-Source-CallLog',
    data: () => ({
        sourceType: 'CallLog',
    }),

    components: {
        SourceComment: () => AsyncComponent(import('../COMMON/index.vue')),
        CallLog_Total: () => AsyncComponent(import('./Section/CallLogTotal.vue')),
        TimeLineDuration: () => AsyncComponent(import('./Section/TimeLineDuration.vue')),
    },
};
</script>
<style lang="sass" scoped></style>
