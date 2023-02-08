<template>
    <el-table-column :key="'index'" align="center" label="#" width="50px">
        <template #default="{ $index }">{{ (currentPage - 1) * pageSize + $index + 1 }}</template>
    </el-table-column>
</template>
<script>
export default {
    name: 'Page-Statistic-Contrast-Components-emotion-Components-Table-Index',
    props: {
        currentPage: Number,
        pageSize: Number,
    },
};
</script>
