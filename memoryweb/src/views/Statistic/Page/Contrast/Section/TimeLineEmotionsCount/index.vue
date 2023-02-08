<template>
    <TimeLine
        :sourceType="sourceType"
        :url="url"
        :plotOptions="{ plot: { color: CONST_USE_COLOR_MAP }, extra: { columns: 'one-columns' } }"
    >
        <template #title>
            <AvatarTip :title="'表情发送次数'" />
        </template>
    </TimeLine>
</template>
<script>
import TimeLine from '../../../../components/Plot/TimeLine/index.vue';
import {
    SOURCE_TYPE_TOTAL,
    SOURCE_TYPE_CONTRAST,
    DEFAULT_AVATAR_COME,
    DEFAULT_AVATAR_GO,
    DIRECTION_TYPE_ALL,
} from '../../../../const.js';
import { CONST_USE_COLOR_MAP } from '@/views/Statistic/components/Plot/utils/index.js';

import AvatarTip from '../../components/AvatarTip.vue';

export default {
    name: 'Statistic-Page-Contrast-Section-emotionCount',
    data: () => ({
        CONST_USE_COLOR_MAP,
        DEFAULT_AVATAR_COME,
        DEFAULT_AVATAR_GO,
        SOURCE_TYPE_TOTAL,

        sourceType: SOURCE_TYPE_CONTRAST,
        url: {
            year: `/statistic/${SOURCE_TYPE_CONTRAST}/${DIRECTION_TYPE_ALL}/emotion/timeLine/year.json`,
            month: `/statistic/${SOURCE_TYPE_CONTRAST}/${DIRECTION_TYPE_ALL}/emotion/timeLine/month.json`,
            day: `/statistic/${SOURCE_TYPE_CONTRAST}/${DIRECTION_TYPE_ALL}/emotion/timeLine/day.json`,
        },
    }),
    components: {
        TimeLine,
        AvatarTip,
    },
};
</script>
<style lang="sass" scoped></style>
