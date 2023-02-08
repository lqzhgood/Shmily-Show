import axiosServer from '@/plugins/axios-server';
import { Message } from 'element-ui';
import _ from 'lodash';

// 每次仅修改一个评论
export default {
    namespaced: true,
    state: () => ({
        commentSMsg: null,
        commentEMsg: null,
        commentHtml: '',
        modifyMsgArr: [
            // {
            //     type:'modify/delete',
            //     nMsg:Msg,
            //     deleteAssets:'true/false'
            // }
        ],
    }),
    getters: {},
    mutations: {
        setCommentSMsg(state, msg) {
            state.commentSMsg = msg;
        },
        setCommentEMsg(state, msg) {
            state.commentEMsg = msg;
        },
        setCommentHtml(state, v) {
            state.commentHtml = v.trim().replace(/\n/gm, '');
        },
        pushModifyMsg(state, n) {
            if (Array.isArray(n)) {
                state.modifyMsgArr = n;
            } else {
                const arr = [...state.modifyMsgArr];
                const fI = arr.findIndex(({ nMsg }) => nMsg.id === n.nMsg.id);
                if (fI === -1) {
                    arr.push(n);
                } else {
                    arr[fI] = n;
                }
                state.modifyMsgArr = _.sortBy(arr, 'nMsg.index');
            }
        },
    },
    actions: {
        addComment({ state, commit }) {
            const { commentSMsg, commentEMsg, commentHtml } = state;
            if (!commentEMsg) {
                commit('setCommentEMsg', commentSMsg);
            }

            if (!commentSMsg || !commentHtml) {
                Message.error(`没有 commentSMsg 或 commentHtml`);
                return Promise.resolve();
            }

            if (commentSMsg.ms > commentEMsg.ms) {
                Message.error('起始时间大于结束时间');
                return Promise.resolve();
            }

            return axiosServer
                .post('/comment/add', {
                    sId: commentSMsg.id,
                    sMs: commentSMsg.ms, // 用来排序
                    eId: commentEMsg.id,
                    eMs: commentEMsg.ms,
                    html: commentHtml,
                })
                .then(data => {
                    if (data.code !== 200) throw new Error(data.msg);
                    commit('setCommentSMsg', null);
                    commit('setCommentEMsg', null);
                    commit('setCommentHtml', '');
                    Message.success({
                        duration: 3000,
                        dangerouslyUseHTMLString: true,
                        message: `<pre>${data.msg}</pre>`,
                    });
                })
                .catch(err => {
                    Message.error(err.message);
                });
        },
        ModifyComment({ state, commit }, { msg, comment, newHtml }) {
            const sId = msg.id;
            return axiosServer.post('/comment/modify', { sId, comment, newHtml }).then(data => {
                Message.success({
                    duration: 3000,
                    dangerouslyUseHTMLString: true,
                    message: `<pre>${data.msg}</pre>`,
                });
            });
        },
        DeleteComment({ state, commit }, { msg, comment }) {
            const sId = msg.id;
            return axiosServer.post('/comment/delete', { sId, comment }).then(data => {
                Message.success({
                    duration: 3000,
                    dangerouslyUseHTMLString: true,
                    message: `<pre>${data.msg}</pre>`,
                });
            });
        },
        ModifyMsg({ state, commit }) {
            return axiosServer
                .post('/msg/modify', { modifyMsgArr: state.modifyMsgArr })
                .then(data => {
                    if (data.code !== 200) throw new Error(data.msg);
                    // 成功则清空本地 modifyMsgArr
                    commit('pushModifyMsg', []);
                    Message.success('修改成功');
                })
                .catch(err => {
                    Message.error({ message: err.message, duration: 0, showClose: true });
                });
        },
    },
};
