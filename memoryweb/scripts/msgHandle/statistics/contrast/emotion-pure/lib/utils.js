const _ = require('lodash');

const path = require('path');
const { DIR_WEB_CODE } = require('../../../../../config.js');
const { MATCH_EMOTION_ALT } = require(path.join(DIR_WEB_CODE, './common.js'));

// 判断纯表情
function countPureEmotionMsg(content) {
    if (!_.isString(content)) throw new Error('not found content');

    // 1 先判断是否为空字符 这里可能有 非标的字符
    let s = content.replace(/\s/gim, '').trim();
    if (!s) {
        return 0;
    }

    // 去掉 空白 后, 通过 表情正则 将表情清空 如果此时 s 为空 说明为 纯表情
    s = s.replace(MATCH_EMOTION_ALT, '');

    if (!s) {
        return 1;
    } else {
        return 0;
    }
}

module.exports = {
    countPureEmotionMsg,
};
