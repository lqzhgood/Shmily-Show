<template>
    <el-table-column :key="'count'" prop="count" label="使用次数" align="right" width="100px" header-align="center">
        <template #default="{ row }">
            <div :title="`排名 ${row.index}`" class="countWrap">
                <span class="count">{{ row.count }}</span>
                <span class="percent">{{ row.p }}%</span>
            </div>
        </template>
    </el-table-column>
</template>

<script>
export default {
    name: 'Page-Statistic-Contrast-Components-emotion-Components-Table-Count',
};
</script>

<style lang="sass" scoped>
.countWrap
    white-space: nowrap
    display: flex
    text-align: right
    .count
        flex: 1 0 auto
    .percent
        width: 40px
        display: inline-block
        flex: 0 0 40px
        margin-left: 5px
</style>
