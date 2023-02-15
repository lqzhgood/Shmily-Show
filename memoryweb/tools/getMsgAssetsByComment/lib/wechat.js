const _ = require('lodash');
const { copy } = require('../utils.js');
const { plain } = require('./plain');

const {
    Wechat_Android_type_视频,
    Wechat_Android_type_图片,
    Wechat_Android_type_文件,
    Wechat_Android_type_语音,
    Wechat_Android_type_自定义表情,
} = require('../../../src/components/Msg/source/Wechat/os/Android/types.js');

function wechat(m) {
    const data = m.$Wechat.data;
    switch (m.type) {
        case Wechat_Android_type_视频: {
            const $mp4info = data.$mp4info;
            copy(m, _.get($mp4info, 'mp4Url'));
            copy(m, _.get($mp4info, 'thumbnail'));
            break;
        }
        case Wechat_Android_type_图片: {
            const src = Array.isArray(data.$imgUrl) ? data.$imgUrl[0] : data.$imgUrl;
            copy(m, src);
            break;
        }
        case Wechat_Android_type_文件: {
            const src = _.get(data, '$url_file');
            copy(m, src);
            break;
        }
        case Wechat_Android_type_语音: {
            const $mp3Info = data.$mp3Info;
            copy(m, _.get($mp3Info, 'mp3Url'));
            break;
        }
        // case Wechat_Android_type_自定义表情: {
        //     copy(m, _.get(item, '$url_emoji'));
        //     break;
        // }
    }
}

module.exports = { wechat };
