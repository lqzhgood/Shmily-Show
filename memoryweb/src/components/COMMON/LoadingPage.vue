<template>
    <div :element-loading-text="LOADING_TEXT.value" class="pageLoading" v-loading.fullscreen.lock="isPageLoading"></div>
</template>
<script>
import { LOADING_TEXT } from '@/utils/const.js';

export default {
    data: () => ({
        LOADING_TEXT,
    }),
    computed: {
        isPageLoading() {
            return this.$store.state.app.isPageLoading;
        },
    },
};
</script>
<style lang="sass" scoped>
.pageLoading
    // width: 100vw
    // height: 100vh
</style>
