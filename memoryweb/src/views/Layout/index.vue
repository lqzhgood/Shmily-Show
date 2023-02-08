<template>
    <div id="app">
        <FirstLoading v-if="!initOk" />
        <LoadingPage />
        <AppNav />
        <router-view />
    </div>
</template>

<script>
import LoadingPage from '@/components/COMMON/LoadingPage';

import AppNav from './components/AppNav/index.vue';
import FirstLoading from './components/FirstLoading/index';

export default {
    name: 'App-Layout',
    computed: {
        initOk() {
            return this.$store.state.app.initOk;
        },
    },
    components: {
        AppNav,
        FirstLoading,
        LoadingPage,
    },
};
</script>

<style lang="sass">
@import url('~@/assets/css/icon/icon.css')
@import url('~@/assets/css/font/Roboto/font.css')
@import url('~@/assets/css/font/JetBrainsMono/font.css')
@import url('~@/assets/css/font/SourceCode/source-code-pro.css')
@import url('~@/assets/css/font/SourceCode/source-code-variable.css')
@import url('~@/assets/css/font/SiYuan/font.css')




html,
body
    height: 100%
    margin: 0
    font-family: 'Source Han Sans SC', '微软雅黑', 'Roboto', sans-serif
    // font-weight: 100
#app
    width: 100vw
    height: 100vh
    // display: flex
    // justify-content: center
    // align-items: center
    // background-color: #caeaf7
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale

// #container
//     // max-width: 1000px
//     width: 90%
//     height: 90%
//     display: flex
//     box-shadow: 0 0 20px rgba(0, 0, 0, 0.2)
//     min-width: 600px
//     margin-left: -60px // VerticalDatePicker

.noX
    .el-scrollbar__wrap
        overflow-x: hidden

.Highlight
    color: rgba(0, 0, 0, 0.85)
    background: #ffec3d
</style>
