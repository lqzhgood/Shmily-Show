const { copy } = require('../utils.js');

const {
    is_MobileQQ_Android_type_视频,
    is_MobileQQ_Android_type_图片,
    is_MobileQQ_Android_type_语音,
    is_MobileQQ_Android_type_文件,
    is_MobileQQ_Android_type_混合消息,
} = require('../../../src/components/Msg/source/MobileQQ/os/Android/isTypes.js');

const { MobileQQ_Android_type_图片 } = require('../../../src/components/Msg/source/MobileQQ/os/Android/types.js');

function qq_mobile_android(m) {
    if (is_MobileQQ_Android_type_混合消息(m)) {
        const msgArr = m.$MobileQQ.data.mixArr;
        const imgArr = msgArr.filter(c => c.type === MobileQQ_Android_type_图片);
        for (let i = 0; i < imgArr.length; i++) {
            const c = imgArr[i];
            const src = c.data.imgUrl;
            copy(m, src);
        }
    } else if (is_MobileQQ_Android_type_图片(m)) {
        const url = m.$MobileQQ.data.imgUrl;
        copy(m, url);
    } else if (is_MobileQQ_Android_type_视频(m)) {
        const src = m.$MobileQQ.data.videoLocalUrl;
        copy(m, src);
        const cover = m.$MobileQQ.data.videoCoverUrl;
        copy(m, cover);
    } else if (is_MobileQQ_Android_type_语音(m)) {
        const src = m.$MobileQQ.data.mp3Url;
        copy(m, src);
    } else if (is_MobileQQ_Android_type_文件(m)) {
        const url = m.$MobileQQ.data.fileParse.url;
        copy(m, url, { unLog: true });
    }
}

module.exports = { qq_mobile_android };
