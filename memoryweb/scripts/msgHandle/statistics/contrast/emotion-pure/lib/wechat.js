const { countPureEmotionMsg } = require('./utils.js');

const { Wechat_Android_type_消息 } = require('../../../../../../src/components/Msg/source/Wechat/os/Android/types.js');

function wechat(m) {
    switch (m.type) {
        case Wechat_Android_type_消息: {
            return countPureEmotionMsg(m.content);
        }
    }
    return null;
}
module.exports = {
    wechat,
};
