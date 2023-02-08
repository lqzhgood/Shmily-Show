<template>
    <img :src="src || IMG_ERROR" @error.once="onerror" @click="openPre" class="emotion" loading="lazy" />
</template>
<script>
const IMG_ERROR = '/static/icon/common/img-error.svg';

export default {
    name: 'Page-Statistic-Contrast-Components-emotion-Components-imgBox',
    props: {
        src: {
            type: String,
            default: IMG_ERROR,
        },
    },
    data: () => ({
        IMG_ERROR,
    }),
    methods: {
        onerror($event) {
            $event.target.src = IMG_ERROR;
        },
        openPre($event) {
            this.$hevueImgPreview($event.target.src);
        },
    },
};
</script>
<style lang="sass" scoped>
.emotion
    width: 50px
    height: 50px
    object-fit: scale-down
    display: inline-block
</style>
