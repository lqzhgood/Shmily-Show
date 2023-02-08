// app 全局状态相关  业务无关

export default {
    namespaced: true,
    state: () => ({
        env: process.env.NODE_ENV, // eslint-disable-line
        initOk: false, // 开屏 loading 相关
        initProgress: [],
        isPageLoading: false, // route 切换
    }),
    getters: {
        isDev(state) {
            return state.env === 'development';
        },
        enableComment(state, getters, rootState, rootGetters) {
            // dev 下强制开启 comment
            return getters.isDev || rootState.commentAll.length > 0;
        },
    },
    mutations: {
        setInitOk(state, v = true) {
            state.initOk = v;
        },
        setInitProgress({ initProgress }, v) {
            const f = initProgress.find(x => x.pathname === v.pathname);
            if (!f) {
                initProgress.push(v);
            } else {
                f.progress = v.progress;
            }
        },
        setIsPageLoading(state, on_off) {
            state.isPageLoading = on_off;
        },
    },
    actions: {},
};
