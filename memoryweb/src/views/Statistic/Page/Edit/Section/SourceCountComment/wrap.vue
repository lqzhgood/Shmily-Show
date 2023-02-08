<template>
    <CountWrap>
        <template #default="{ countType }">
            <SourceCount
                :title="data[countType].title"
                :url="makeUrl(countType)"
                style="padding-top: 20px"
                :unit="data[countType].unit"
            />
            <template v-if="countType === COUNT_DB_TYPE_NUM">
                <SourceCount :title="'评论 Tag'" :url="makeUrlTag(countType)" class="commentTag" />
            </template>
        </template>
    </CountWrap>
</template>
<script>
import CountWrap from '@/views/Statistic/components/SelectWrap/CountWrap.vue';
import { SOURCE_TYPE_EDIT, COUNT_DB_TYPE_NUM, COUNT_DB_TYPE_WORDS } from '@/views/Statistic/const.js';
import SourceCount from '@/views/Statistic/components/Plot/SourceCount/index.vue';

export default {
    name: 'Statistic-Components-Edit-Section-SourceCount-wrap',
    data: () => ({
        COUNT_DB_TYPE_NUM,
        COUNT_DB_TYPE_WORDS,
        sourceType: SOURCE_TYPE_EDIT,
    }),
    computed: {
        data() {
            return {
                [COUNT_DB_TYPE_NUM]: {
                    title: '评论条数',
                    unit: '条',
                },
                [COUNT_DB_TYPE_WORDS]: {
                    title: '评论字数',
                    unit: '字',
                },
            };
        },
    },
    methods: {
        makeUrl(countType) {
            return `/statistic/${SOURCE_TYPE_EDIT}/${countType}/comment-sourceCount.json`;
        },
        makeUrlTag(countType) {
            return `/statistic/${SOURCE_TYPE_EDIT}/${countType}/comment-tag-sourceCount.json`;
        },
    },
    components: {
        CountWrap,
        SourceCount,
    },
};
</script>
<style lang="sass" scoped>
.commentTag
    margin-top: 10px
</style>
