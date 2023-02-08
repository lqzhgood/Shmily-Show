<template>
    <!-- https://codepen.io/sahilpro/pen/abBJwqo -->
    <div class="Statistic">
        <sidebar class="sidebar" />
        <!-- <div class="code-with-love">
            &lt;
            <span>/</span>
            > with
            <i class="fa fa-heart"></i>
            by
            <a href="https://instagram.com/theviralboy.ig" target="blank">Sahil Verma</a>
        </div> -->

        <el-scrollbar class="noX" style="height: 100%">
            <router-view :key="$route.fullPath" class="main"></router-view>
        </el-scrollbar>
    </div>
</template>

<script>
import sidebar from './components/Sidebar/index.vue';

export default {
    name: 'Page-Statistic',
    mounted() {
        this.$store.commit('app/setInitOk');
    },
    data: () => ({}),
    components: {
        sidebar,
    },
};
</script>

<style lang="sass" scoped>
.Statistic
    position: relative
    height: 100vh
    width: 100vw
    background: rgb(62, 30, 242)
    // background: linear-gradient( 315deg, rgba(62, 30, 242, 1) 0%, rgba(174, 128, 214, 1) 100% )
    background: radial-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3)), url('./assets/wallhaven-576j18.png')
    padding-left: 80px
    padding-top: 10px
    padding-bottom: 10px
    box-sizing: border-box
    background-attachment: fixed
    .sidebar
        position: fixed
        left: 10px
        top: 10px
    .main
        width: calc( 100vw - 90px )
    .code-with-love
        position: absolute
        right: 30px
        bottom: 50px
        border-radius: 5px
        background-color: #111
        padding: 10px
        color: #fff
        z-index: 99999999
        i.fa-heart, span
            color: #ff2828
</style>
