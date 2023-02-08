const { countPureEmotionMsg } = require('./utils.js');

const {
    is_MobileQQ_Android_type_消息,
    is_MobileQQ_Android_type_混合消息,
} = require('../../../../../../src/components/Msg/source/MobileQQ/os/Android/isTypes.js');

const {
    MobileQQ_Android_type_自定义表情,
} = require('../../../../../../src/components/Msg/source/MobileQQ/os/Android/types.js');

function qq_mobile_android(m) {
    if (is_MobileQQ_Android_type_混合消息(m)) {
        const msgArr = m.$MobileQQ.data.mixArr;
        const isAllEmotion = msgArr.every(v => v.type === MobileQQ_Android_type_自定义表情);
        return isAllEmotion ? 1 : 0;
    } else if (is_MobileQQ_Android_type_消息(m)) {
        return countPureEmotionMsg(m.content);
    }

    return null;
}

module.exports = { qq_mobile_android };
