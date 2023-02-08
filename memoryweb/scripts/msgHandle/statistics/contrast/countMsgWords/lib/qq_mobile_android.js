const { countWordByHtml } = require('../utils.js');

const {
    is_MobileQQ_Android_type_消息,
    is_MobileQQ_Android_type_混合消息,
    is_MobileQQ_Android_type_语音,
} = require('../../../../../../src/components/Msg/source/MobileQQ/os/Android/isTypes.js');

const {
    MobileQQ_Android_type__文本,
} = require('../../../../../../src/components/Msg/source/MobileQQ/os/Android/types.js');

function qq_mobile_android(m) {
    if (is_MobileQQ_Android_type_混合消息(m)) {
        const msgArr = m.$MobileQQ.data.mixArr;
        for (let i = 0; i < msgArr.length; i++) {
            const mInner = msgArr[i];
            if (mInner.type === MobileQQ_Android_type__文本) {
                return countWordByHtml(mInner.html);
            }
        }
    } else if (is_MobileQQ_Android_type_消息(m)) {
        return countWordByHtml(m.html);
    } else if (is_MobileQQ_Android_type_语音(m)) {
        return m.$MobileQQ.data.sttText.length;
    }

    return 0;
}

module.exports = { qq_mobile_android };
