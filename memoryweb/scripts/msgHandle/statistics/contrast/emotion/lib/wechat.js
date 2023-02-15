const _ = require('lodash');
const { countEmotionByHtml } = require('./utils.js');

const {
    Wechat_Android_type_消息,
    Wechat_Android_type_自定义表情,
} = require('../../../../../../src/components/Msg/source/Wechat/os/Android/types.js');

function wechat(m) {
    const data = m.$Wechat.data;
    switch (m.type) {
        case Wechat_Android_type_消息: {
            return countEmotionByHtml(m.html, '/baseEmoji/');
        }
        case Wechat_Android_type_自定义表情: {
            const packName = _.get(data, '$packName', '其他');
            const des = _.get(data, '$desc', '未知');
            const url = _.get(data, '$url_emoji', null);
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
