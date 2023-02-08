const { countEmotionByHtml } = require('./utils.js');

const {
    is_MobileQQ_Android_type_消息,
    is_MobileQQ_Android_type_自定义表情,
    is_MobileQQ_Android_type_混合消息,
} = require('../../../../../../src/components/Msg/source/MobileQQ/os/Android/isTypes.js');

const {
    MobileQQ_Android_type__文本,
    MobileQQ_Android_type_自定义表情,
} = require('../../../../../../src/components/Msg/source/MobileQQ/os/Android/types.js');

function qq_mobile_android(m) {
    if (is_MobileQQ_Android_type_混合消息(m)) {
        const msgArr = m.$MobileQQ.data.mixArr;
        for (let i = 0; i < msgArr.length; i++) {
            const mInner = msgArr[i];
            if (mInner.type === MobileQQ_Android_type__文本) {
                return countEmotionByHtml(mInner.html, '/qq-android/emoji/');
            } else if (mInner.type === MobileQQ_Android_type_自定义表情) {
                const packName = mInner.data.packName;
                const des = mInner.data.desc;
                const url = mInner.data.webUrl;
                return [
                    {
                        packName,
                        des,
                        url,
                    },
                ];
            }
        }
    } else if (is_MobileQQ_Android_type_消息(m)) {
        return countEmotionByHtml(m.html, '/qq-android/emoji/');
    } else if (is_MobileQQ_Android_type_自定义表情(m)) {
        const packName = m.$MobileQQ.data.packName;
        const des = m.$MobileQQ.data.desc;
        const url = m.$MobileQQ.data.webUrl;
        return [
            {
                packName,
                des,
                url,
            },
        ];
    }

    return null;
}

module.exports = { qq_mobile_android };
