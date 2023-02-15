<template>
    <MsgWrap class="source-MobileQQ s60v3">
        <div :class="{ hasFile: fileParse }">
            <div v-html="msg.html"></div>

            <File :fileParse="fileParse" :msg="msg" :url="url" v-if="fileParse" />
        </div>
    </MsgWrap>
</template>
<script>
import { fileExist } from '@/utils/net';

export default {
    name: 'Source-MobileQQ-s60v3',
    async mounted() {
        if (this.fileParse) {
            const exist = await fileExist(this.fileParse.url);
            this.isNotExist = !exist;
        }
    },
    props: {
        msg: Object,
    },
    data: () => ({
        isNotExist: false,
    }),
    computed: {
        fileParse() {
            return this.msg.$MobileQQ.data?.fileParse;
        },
        url() {
            return this.fileParse.url;
        },
    },
    components: {
        File: () => import('../../../../components/Type/File-Simple/index.vue'),
    },
};
</script>
<style lang="sass" scoped>
.source-MobileQQ.s60v3
    max-width: 216px // 根据 2010-08-04_11-37-34 消息内容(表情拼图) 倒推 S60v3 消息宽度是 215-240之间 取最小值(不然右边有 padding)
</style>
