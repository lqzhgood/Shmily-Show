<template>
    <div class="AvatarTip">
        <span>{{ title }}</span>
        <div style="margin: 0 10px 0 20px" class="icon">
            <img class="avatar" :src="DEFAULT_AVATAR_COME" />
            <span>come</span>
        </div>
        <div class="icon">
            <img class="avatar" :src="DEFAULT_AVATAR_GO" />
            <span>go</span>
        </div>
    </div>
</template>
<script>
import { DEFAULT_AVATAR_COME, DEFAULT_AVATAR_GO } from '../../../const.js';

export default {
    name: 'Statistic-Page-Contrast-Components-AvatarTip',
    props: {
        title: String,
    },
    data: () => ({
        DEFAULT_AVATAR_COME,
        DEFAULT_AVATAR_GO,
    }),
};
</script>
<style lang="sass" scoped>
.AvatarTip
    display: inline-block
    display: flex
    justify-content: center
    align-items: center
    .icon
        display: flex
        justify-content: center
        align-items: center
        .avatar
            width: 16px
            height: 16px
            margin-right: 5px
</style>
