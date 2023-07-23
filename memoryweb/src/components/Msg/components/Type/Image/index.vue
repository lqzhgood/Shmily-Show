<template>
    <div class="Msg-common-image">
        <img :src="src || errSrc" @error.once="onerror" class="img" loading="lazy" />
    </div>
</template>
<script>
export default {
    name: 'Msg-common-image',
    props: {
        src: String,
    },
    data: () => ({
        errSrc: require('./error.svg'),
    }),
    methods: {
        onerror($event) {
            $event.target.src = this.errSrc;
        },
    },
};
</script>
<style lang="sass" scoped>
@import '~@/styles/vars.module.sass'

.Msg-common-image
    cursor: pointer
    display: flex
    justify-content: center
    align-items: center
    .img
        min-width: 150px
        min-height: 50px
        max-width: $msgBoxMaxWidth !important
</style>
