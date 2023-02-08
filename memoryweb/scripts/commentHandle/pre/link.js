const path = require('path');
const cheerio = require('cheerio');
const _ = require('lodash');

const { FILE_OUTPUT_JSON_MSG, FILE_OUTPUT_COMMENTS, DIR_WEB_CODE } = require('../../config.js');
const { getJSON, setJSON } = require('../../utils/index');
const { getInnerLinkId } = require('../utils.js');
const { MSG_SLICE, IS_COMMENT_INNER_LINK_FLAG, makeInnerTextById } = require(path.join(DIR_WEB_CODE, './common.js'));
const { COMMENT_TYPE_INNER_LINK_FROM } = require(path.join(DIR_WEB_CODE, './components/Comment/const.js'));

const cArr = getJSON(FILE_OUTPUT_COMMENTS);
const msgAll = getJSON(FILE_OUTPUT_JSON_MSG);

// eslint-disable-next-line
if (cArr.length === 0) return;

const msg_S = _.head(msgAll);
const msg_E = _.last(msgAll);

makeInnerIdVNode(cArr);
makeInnerLink(cArr);

function makeInnerIdVNode(arr) {
    arr.forEach(c => {
        if (!c?.html) return;

        const $ = cheerio.load(c.html, { decodeEntities: false }, false);
        $('a[innerlink]').replaceWith((i, elm) => {
            const id = getInnerLinkId(elm);

            if (!id) {
                return elm;
            }

            if (!c.innerId) {
                c.innerId = {
                    to: [],
                    from: [],
                };
            }
            c.innerId.to.push(id);

            // 寻找 DOM NODE 的顺序应该从上至下 从浅入深
            // 潜在的问题是 cheerio 必须遵循次规则
            // 不然模板替换就会错位
            return IS_COMMENT_INNER_LINK_FLAG;
        });

        if (c.innerId) {
            c.vNodeTmpl = $.html();
        }
    });
}

function makeInnerLink(arr) {
    // makeInnerIdVNode 就已经把每条评论里面的 linkId 找出来 放到 c.innerId.to 中了
    arr.forEach(c => {
        if (!c?.innerId) return;
        const toArr = c.innerId.to;

        // 通过 to 找到对应的评论 写入 from, 形成双向链接
        for (let i = 0; i < toArr.length; i++) {
            const tId = toArr[i];

            const msgIndex = msgAll.findIndex(m => m.id === tId);
            // console.log('msgIndex', msgIndex);
            if (msgIndex > -1) {
                // 有可能找到的 msg 位置没有评论 c = undefined
                if (!arr[msgIndex]) {
                    arr[msgIndex] = {};
                }
                if (!arr[msgIndex].innerId) {
                    arr[msgIndex].innerId = {
                        to: [],
                        from: [],
                    };
                }
                arr[msgIndex].innerId.from.push(c.msgId);
            } else {
                // 没找到的情况
                if (MSG_SLICE) {
                    const currToMsgIdMs = new Date(makeInnerTextById(tId)).getTime();
                    if (currToMsgIdMs > msg_S.ms && currToMsgIdMs < msg_E.ms) {
                        console.error(`${tId} 没找到对应的评论`);
                        throw new Error();
                    } else {
                        // 因为不是完整的 msg ，边界以外的没找到很正常 不处理
                    }
                } else {
                    // 完整的 msg 都没找到 那么 ID 就有问题了
                    console.error(`${tId} 没找到对应的评论`);
                    throw new Error();
                }
            }
        }
    });

    // 对所有的 innerId-from 进行排序并去重
    // to 不要排序，因为要按顺序填充 vnode
    arr.forEach(c => {
        if (!c.innerId) return;
        c.innerId.from = _(c.innerId.from)
            .difference(c.innerId.to)
            .uniq()
            .sortBy(id => new Date(makeInnerTextById(id)).getTime())
            .value();

        if (c.innerId.from.length > 0) {
            if (!c.type) {
                c.type = [];
            }
            c.type.push(COMMENT_TYPE_INNER_LINK_FROM);
        }
    });
}

setJSON(FILE_OUTPUT_COMMENTS, cArr);
