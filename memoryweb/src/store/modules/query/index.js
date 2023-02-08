// query 页面

export default {
    namespaced: true,
    state: () => ({
        scrollToPosition: 'none',
    }),
    getters: {},
    mutations: {
        setScrollToPosition(state, v = 'none') {
            state.scrollToPosition = v;
        },
    },
    actions: {},
};
