import { DIRECTION_TYPE_ALL, DEFAULT_AVATAR_COME, DEFAULT_AVATAR_GO } from '../../../../const.js';

export default {
    props: {
        title: { type: String, default: '' },
        unit: { type: String, default: '条' },
        url: [String, Object],
        sourceType: { type: String },
        directionType: {
            type: String,
            default: DIRECTION_TYPE_ALL,
        },
        plotOptions: { type: Object, default: () => ({ plot: {}, extra: {} }) },
    },
    data: () => ({
        DEFAULT_AVATAR_COME,
        DEFAULT_AVATAR_GO,
        $plot: null, // $ 让 vue不添加 getter setter
        loading: true,
    }),
    computed: {
        needUpdate() {
            // debug
            // console.log(JSON.stringify(this.sourceType, null, 4));
            // console.log(JSON.stringify(this.directionType, null, 4));
            // console.log(JSON.stringify(this.url, null, 4));
            return {
                sourceType: this.sourceType,
                directionType: this.directionType,
                url: this.url,
            };
        },
    },
    watch: {
        needUpdate: {
            immediate: true,
            deep: true,
            async handler() {
                await this.updatePlot();
            },
        },
    },
    methods: {
        async toggleLoading(b) {
            if (b) {
                this.loading = b;
                await this.$nextTick();
            } else {
                await this.$nextTick();
                this.loading = b;
            }
        },
    },
    beforeDestroy() {
        // 有一些没有 图表 的组件
        if (this.$plot) this.$plot.destroy();
    },
};
