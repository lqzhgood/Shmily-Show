const { countEmotionByHtml } = require('./utils.js');

const { QQ_type_消息 } = require('../../../../../../src/components/Msg/source/QQ/types.js');

function qq_pc(m) {
    if (m.type === QQ_type_消息) {
        return countEmotionByHtml(m.html, '/qq-pc/face/');
    }
    return null;
}

module.exports = { qq_pc };
