<template>
    <el-divider class="hr"><i :class="icon"></i></el-divider>
</template>
<script>
export default {
    name: 'Page-Statistic-Component-SectionHr',
    props: {
        icon: String,
    },
    data: () => ({}),
};
</script>
<style lang="sass" scoped>
.hr
    margin: 12px 0
    ::v-deep
        .el-divider__text.is-center
            border-radius: 10px
</style>
