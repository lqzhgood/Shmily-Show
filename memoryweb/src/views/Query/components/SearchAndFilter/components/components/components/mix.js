import _ from 'lodash';
import { copyText } from '@/utils/index.js';
import { makeSearchKeyTypeArr } from '../../../utils.js';

export default {
    inject: ['localSearch'],
    data: () => ({
        isFirstSearch: true,
        filterData: [],
    }),
    computed: {
        keyArrByType() {
            return makeSearchKeyTypeArr(this.localSearch.key);
        },
        msgAll() {
            return this.$store.state.msgAll;
        },
    },
    watch: {
        localSearch: {
            deep: true,
            immediate: true,
            handler: _.debounce(async function (v) {
                this.$store.commit('query/search/setLoading', true);
                await this.$nextTick();

                // 计算不阻塞 页面 loading 效果
                // 50 是经验值,主要是为了能让 loading 渲染出来,再进行计算,不然主线程被计算卡住以后 loading 渲染不出来

                setTimeout(() => {
                    this.searchHandler();
                    if (this.$refs?.tableWrap && !this.isFirstSearch) {
                        this.$refs.tableWrap.resetPage();
                    }
                    this.isFirstSearch = false;
                }, 50);

                // 因为是异步操作 有可能此时窗口已经关闭 tableWrap 已经销毁
                // 页码的变更只在修改 [搜索关键词和类别时触发]
                // 但是刚打开时的触发就会覆盖掉之前的页码
            }, 1000),
        },
    },
    methods: {
        copyText(text) {
            copyText(text, this.$message.success);
        },
        log(row) {
            console.log(row);
        },
    },
};
