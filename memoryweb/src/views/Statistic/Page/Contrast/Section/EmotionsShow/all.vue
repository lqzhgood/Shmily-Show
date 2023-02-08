<template>
    <LoadingDiv v-loading="loading">
        <EmotionsPkg v-if="comp.dbType === EMOTIONS_DB_TYPE_PACK_NAME" :data="comp.db" />
        <EmotionsDes v-else-if="comp.dbType === EMOTIONS_DB_TYPE_DES" :data="comp.db" />
    </LoadingDiv>
</template>
<script>
import AsyncComponent from '@/components/AsyncComponent';
import axiosJson from '@/plugins/axios-json';
import { deepFreeze } from '@/utils/index.js';
import {
    SOURCE_TYPE_CONTRAST,
    EMOTIONS_DB_TYPE_PACK_NAME,
    EMOTIONS_DB_TYPE_DES,
    DIRECTION_TYPE_ALL,
} from '@/views/Statistic/const.js';

export default {
    name: 'Statistic-Contrast-Emotions-index',
    props: {
        dbType: String,
    },
    data: () => ({
        EMOTIONS_DB_TYPE_PACK_NAME,
        EMOTIONS_DB_TYPE_DES,

        loading: false,
        comp: {
            dbType: '',
            db: undefined,
        },
    }),
    watch: {
        dbType: {
            immediate: true,
            async handler() {
                await this.getDb();
            },
        },
    },
    methods: {
        async getDb() {
            this.loading = true;

            const db = await axiosJson.get(
                `/statistic/${SOURCE_TYPE_CONTRAST}/${DIRECTION_TYPE_ALL}/emotion/${this.dbType}.json`,
            );
            this.comp = deepFreeze({
                dbType: this.dbType,
                db,
            });

            await this.$nextTick();
            this.loading = false;
        },
    },
    components: {
        EmotionsPkg: () => AsyncComponent(import('./components/Emotions-Pkg.vue')),
        EmotionsDes: () => AsyncComponent(import('./components/Emotions-Des.vue')),
    },
};
</script>
<style lang="sass" scoped></style>
