const {
    Wechat_Android_type_图片,
    Wechat_Android_type_视频,
} = require('../../../../Msg/source/Wechat/os/Android/types.js');

export default _this => [
    {
        label: 'wechat-图片',
        fn: async msg => {
            msg.type = Wechat_Android_type_图片;

            const [errInput, fileName] = await _this.msgBoxPrompt({
                title: '输入文件名',
                message: './data/wechat-manual/image2/',
            });
            if (errInput) return null;

            const imgUrl = './data/wechat-manual/image2/' + fileName.trim();
            msg.$Wechat.data.$imgUrl.unshift(imgUrl);

            return msg;
        },
    },
    {
        label: 'wechat-视频',
        fn: async msg => {
            msg.type = Wechat_Android_type_视频;

            const [errInput, fileName] = await _this.msgBoxPrompt({
                title: '输入文件名',
                message: './data/wechat-manual/video/',
            });
            if (errInput) return null;

            const mp4Url = './data/wechat-manual/video/' + fileName.trim();
            msg.$Wechat.data.$mp4info.mp4Url = mp4Url;

            return msg;
        },
    },
];
