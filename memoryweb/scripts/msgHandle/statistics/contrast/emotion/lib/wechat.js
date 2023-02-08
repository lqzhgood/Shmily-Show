const _ = require('lodash');
const { countEmotionByHtml } = require('./utils.js');

const {
    Wechat_Android_type_消息,
    Wechat_Android_type_自定义表情,
} = require('../../../../../../src/components/Msg/source/Wechat/os/Android/types.js');

function wechat(m) {
    const item = m.$Wechat.webData;
    switch (m.type) {
        case Wechat_Android_type_消息: {
            return countEmotionByHtml(m.html, '/baseEmoji/');
        }
        case Wechat_Android_type_自定义表情: {
            const packName = _.get(item, '$packName', '其他');
            const des = _.get(item, '$desc', '未知');
            const url = _.get(item, '$url_emoji', null);
            return [
                {
                    packName,
                    des,
                    url,
                },
            ];
        }
    }
    return null;
}
module.exports = {
    wechat,
};
