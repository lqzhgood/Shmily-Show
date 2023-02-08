<template>
    <div class="page-not-found">
        <div class="content">
            <img src="./assets/error.png" />
            <div class="text">
                <div class="path">{{ path }}</div>
                <el-link title="Go Home Page" @click="$router.push('/')">Page Not Found</el-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'page-not-found',
    mounted() {
        this.$store.commit('app/setInitOk');
        console.log('this.$route', this.$route);
    },
    data: () => ({}),
    computed: {
        path() {
            return this.$route.fullPath;
        },
    },
};
</script>
<style lang="sass" scoped>
.page-not-found
    display: flex
    width: 100vw
    height: 100vh
    align-items: center
    justify-content: center
    background: linear-gradient(45deg, #2B546D, #79B0B6)
    .content
        color: #fff
        text-align: center
        position: relative
        img
            max-width: 100%
            max-height: 100%
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
        .text
            position: absolute
            bottom: 10px
            left: 50%
            transform: translateX(-50%)
            ::v-deep
                .el-link--inner
                    color: #fff
</style>
