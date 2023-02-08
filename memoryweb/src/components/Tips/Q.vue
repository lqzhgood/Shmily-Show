<template>
    <el-tooltip effect="light">
        <template #content>
            <slot></slot>
        </template>
        <i class="el-icon-question"></i>
    </el-tooltip>
</template>
<script>
export default {
    name: 'Components-Tips-Q',
    data: () => ({}),
};
</script>
<style lang="sass" scoped></style>
