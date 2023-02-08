<template>
    <TimeLine :sourceType="sourceType" :url="url">
        <template #title>
            <div>
                <span style="vertical-align: middle">通话时长 单位(s)</span>
                <div style="display: inline-block; margin: 0 10px 0 20px">
                    <img
                        style="width: 16px; height: 16px; vertical-align: middle; margin-right: 5px"
                        :src="DEFAULT_AVATAR_GO"
                    />
                    <span style="vertical-align: middle">主叫</span>
                </div>
                <div style="display: inline-block">
                    <img
                        style="width: 16px; height: 16px; vertical-align: middle; margin-right: 5px"
                        :src="DEFAULT_AVATAR_COME"
                    />
                    <span style="vertical-align: middle">被叫</span>
                </div>
            </div>
        </template>
    </TimeLine>
</template>
<script>
import AsyncComponent from '@/components/AsyncComponent';
import { DEFAULT_AVATAR_COME, DEFAULT_AVATAR_GO, DIRECTION_TYPE_ALL } from '@/views/Statistic/const.js';

export default {
    name: 'Page-Statistic-Source-CallLog-Component-index',
    data: () => ({
        DEFAULT_AVATAR_COME,
        DEFAULT_AVATAR_GO,
        sourceType: 'CallLog',
    }),
    computed: {
        url() {
            return {
                year: `/statistic/${this.sourceType}/${DIRECTION_TYPE_ALL}/timeLine-duration/year.json`,
                month: `/statistic/${this.sourceType}/${DIRECTION_TYPE_ALL}/timeLine-duration/month.json`,
                day: `/statistic/${this.sourceType}/${DIRECTION_TYPE_ALL}/timeLine-duration/day.json`,
            };
        },
    },
    components: {
        TimeLine: () => AsyncComponent(import('../../../../components/Plot/TimeLine/index.vue')),
    },
};
</script>
<style lang="sass" scoped></style>
