<template>
    <el-card :element-loading-text="LOADING_TEXT.value" v-bind="$props" v-on="$listeners">
        <template v-for="(index, name) in $slots" :slot="name">
            <slot :name="name" />
        </template>
    </el-card>
</template>
<script>
import { Card } from 'element-ui';
import { LOADING_TEXT } from '@/utils/const.js';

export default {
    name: 'Card-Wrap',
    data: () => ({
        LOADING_TEXT,
    }),
    props: {
        ...Card.props,
        bodyStyle: {
            default: () => ({
                padding: '10px',
            }),
        },
    },
};
</script>
<style lang="sass" scoped></style>
