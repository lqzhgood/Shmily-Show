const { countPureEmotionMsg } = require('./utils.js');

const { QQ_type_消息 } = require('../../../../../../src/components/Msg/source/QQ/types.js');

function qq_pc(m) {
    if (m.type === QQ_type_消息) {
        return countPureEmotionMsg(m.content);
    }
    return null;
}

module.exports = { qq_pc };
