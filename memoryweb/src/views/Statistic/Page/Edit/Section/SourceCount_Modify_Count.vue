<template>
    <SourceCount :url="url">
        <template #title>
            <span>
                聊天记录编辑
                <TipsQ>
                    <div>对导出的重复消息进行手动删除与修改</div>
                    <div>这里仅统计无法自动去重 通过手动处理的数量</div>
                    <div>例如 QQ 因为自动同步导致 QQ 和 MobileQQ 的重复消息</div>
                </TipsQ>
            </span>
        </template>
    </SourceCount>
</template>
<script>
import TipsQ from '@/components/Tips/Q.vue';
import SourceCount from '@/views/Statistic/components/Plot/SourceCount/index.vue';
import { SOURCE_TYPE_EDIT } from '../../../const.js';

export default {
    name: 'Page-Statistic-Source-Edit-Section-SourceCount_Modify',
    props: {
        sourceType: { type: String },
    },
    data: () => ({
        url: `/statistic/${SOURCE_TYPE_EDIT}/modify-sourceCount.json`,
    }),
    components: {
        SourceCount,
        TipsQ,
    },
};
</script>
<style lang="sass" scoped></style>
