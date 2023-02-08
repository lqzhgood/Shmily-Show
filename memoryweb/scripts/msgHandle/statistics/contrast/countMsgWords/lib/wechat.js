const { countWordByHtml } = require('../utils.js');

const {
    Wechat_Android_type_消息,
    Wechat_Android_type_红包,
} = require('../../../../../../src/components/Msg/source/Wechat/os/Android/types.js');

function wechat(m) {
    switch (m.type) {
        case Wechat_Android_type_消息: {
            return countWordByHtml(m.html);
        }
        case Wechat_Android_type_红包:
            return countWordByHtml(m.html, ['恭喜发财，大吉大利！']);
        default:
            return 0;
    }
}
module.exports = {
    wechat,
};
