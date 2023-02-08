<template>
    <div class="footer">
        <i class="material-icons" @click="tip('消息都发不了，别说附件了')">attach_file</i>
        <textarea class="input" placeholder="Shmily..."></textarea>
        <i class="material-icons" @click="tip('别发了吧~')">send</i>
    </div>
</template>
<script>
export default {
    name: 'Query-Main-Footer',
    data: () => ({}),
    methods: {
        tip(s) {
            this.$message.warning(s);
        },
    },
};
</script>
<style lang="sass" scoped>
.footer
    background-color: #fff
    padding: 10px
    display: flex
    justify-content: space-between
    .input
        flex-grow: 2
        margin: 0 10px
        resize: none
        border: none
        padding-top: 5px
        height: 20px
        &:focus
            outline: none
    .material-icons
        color: #c0c0c0
        cursor: pointer
        user-select: none
        &:hover
            color: #409EFF
            transition: all 0.3s
</style>
