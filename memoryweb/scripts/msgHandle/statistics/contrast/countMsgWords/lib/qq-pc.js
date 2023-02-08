const { countWordByHtml } = require('../utils.js');

const { QQ_type_消息, QQ_type_语音, QQ_type_图片 } = require('../../../../../../src/components/Msg/source/QQ/types.js');

function qq_pc(m) {
    switch (m.type) {
        case QQ_type_消息:
        case QQ_type_语音:
        case QQ_type_图片:
            return countWordByHtml(m.html);

        default:
            return 0;
    }
}

module.exports = { qq_pc };
