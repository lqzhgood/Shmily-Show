<template>
    <LoadingDiv v-loading="loading">
        <el-row :gutter="10" class="row" type="flex" v-if="comp.dbType">
            <el-col :span="12">
                <component :is="emotionComponent" :data="comp.db_come">
                    <template slot="title">
                        <img class="avatar" :src="DEFAULT_AVATAR_COME" />
                        <span class="label">表情包数量:</span>
                        <span class="count">{{ comp.db_come.packCount }}</span>

                        <span class="label">表情数量:</span>
                        <span class="count">{{ comp.db_come.desCount }}</span>

                        <span class="label">文件数量:</span>
                        <span class="count">{{ comp.db_come.emotionCount }}</span>
                    </template>
                </component>
            </el-col>
            <el-col :span="12">
                <component :is="emotionComponent" :data="comp.db_go">
                    <template slot="title">
                        <img class="avatar" :src="DEFAULT_AVATAR_GO" />
                        <span class="label">表情包数量:</span>
                        <span class="count">{{ comp.db_go.packCount }}</span>

                        <span class="label">表情数量:</span>
                        <span class="count">{{ comp.db_go.desCount }}</span>

                        <span class="label">文件数量:</span>
                        <span class="count">{{ comp.db_go.emotionCount }}</span>
                    </template>
                </component>
            </el-col>
        </el-row>
    </LoadingDiv>
</template>
<script>
import AsyncComponent from '@/components/AsyncComponent';
import axiosJson from '@/plugins/axios-json';
import { deepFreeze } from '@/utils/index.js';
import {
    SOURCE_TYPE_CONTRAST,
    DEFAULT_AVATAR_GO,
    DEFAULT_AVATAR_COME,
    EMOTIONS_DB_TYPE_PACK_NAME,
    EMOTIONS_DB_TYPE_DES,
    DIRECTION_TYPE_GO,
    DIRECTION_TYPE_COME,
} from '@/views/Statistic/const.js';

export default {
    name: 'Statistic-Contrast-Emotions-diff',
    props: {
        dbType: String,
    },
    data: () => ({
        DEFAULT_AVATAR_GO,
        DEFAULT_AVATAR_COME,
        EMOTIONS_DB_TYPE_PACK_NAME,
        EMOTIONS_DB_TYPE_DES,

        loading: false,
        comp: {
            dbType: '',
            db_come: undefined,
            db_go: undefined,
        },
    }),
    computed: {
        emotionComponent() {
            switch (this.comp.dbType) {
                case EMOTIONS_DB_TYPE_PACK_NAME:
                    return () => AsyncComponent(import('./components/Emotions-Pkg.vue'));

                case EMOTIONS_DB_TYPE_DES:
                    return () => AsyncComponent(import('./components/Emotions-Des.vue'));
                default:
                    console.log('this.comp.dbType', this.comp.dbType);
                    throw new Error('unknown dbType');
            }
        },
    },
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

            const ajax_go = axiosJson.get(
                `/statistic/${SOURCE_TYPE_CONTRAST}/${DIRECTION_TYPE_GO}/emotion/${this.dbType}.json`,
            );
            const ajax_come = axiosJson.get(
                `/statistic/${SOURCE_TYPE_CONTRAST}/${DIRECTION_TYPE_COME}/emotion/${this.dbType}.json`,
            );

            const [db_go, db_come] = await Promise.all([ajax_go, ajax_come]);
            this.comp = deepFreeze({
                dbType: this.dbType,
                db_go,
                db_come,
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
