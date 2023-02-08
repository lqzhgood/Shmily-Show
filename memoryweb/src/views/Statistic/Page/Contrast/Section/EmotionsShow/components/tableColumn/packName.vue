<template>
    <el-table-column :key="'packName'" prop="packName" label="表情包名称" width="80px" align="center">
        <template #default="{ row }">
            <b>{{ row.packName }}</b>
        </template>
    </el-table-column>
</template>
<script>
export default {
    name: 'Page-Statistic-Contrast-Components-emotion-Components-Table-packName',
};
</script>
