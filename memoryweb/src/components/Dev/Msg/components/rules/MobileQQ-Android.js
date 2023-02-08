import _ from 'lodash';
import { Message } from 'element-ui';

const { htmlToText } = require('@/utils/index.js');
const {
    is_MobileQQ_Android_type_视频,
    is_MobileQQ_Android_type_图片,
    is_MobileQQ_Android_type_混合消息,
} = require('@/components/Msg/source/MobileQQ/os/Android/isTypes.js');

const {
    MobileQQ_Android_type_图片,
    MobileQQ_Android_type_自定义表情,
    MobileQQ_Android_type_消息,
} = require('@/components/Msg/source/MobileQQ/os/Android/types.js');

// src\components\Msg\source\MobileQQ\os\Android\index.vue
export default _this => [
    {
        label: '图->自定义表情',
        filter: msg => is_MobileQQ_Android_type_图片(msg) && !is_MobileQQ_Android_type_混合消息(msg),
        fn: async msg => {
            msg.type = MobileQQ_Android_type_自定义表情;

            // 获取表情信息
            const eInfo = await getEmoticonInfo(_this);
            if (!eInfo) return null;
            const { packName, desc } = eInfo;

            // 修改表情 url
            let url = msg.$MobileQQ.data.imgUrl;
            if (!url) {
                url = await getEmoticonUrl(_this, packName);
                if (!url) return null;
            }

            // 修改查询信息
            msg.content = `[${packName}-${desc}]`;
            msg.html = msg.content;

            // 组装
            msg.$MobileQQ = {
                os: 'Android', // !!! important
                data: {
                    webUrl: url,
                    packName,
                    desc,
                    mark: '', // mark 不填算了，如果要做的话，需要从 EmoticonPackage.json 中读取
                },
            };
            return msg;
        },
    },
    {
        filter: msg => is_MobileQQ_Android_type_混合消息(msg),
        label: '混合信息 图->表情',
        fn: async msg => {
            const list = _.get(msg, '$MobileQQ.data.mixArr');
            const num = list.filter(m => m.type === MobileQQ_Android_type_图片).length;
            if (num === 0) {
                Message({ type: 'error', message: `没找到图片` });
                return null;
            }
            if (num !== 1) {
                Message({ type: 'error', message: `有多个 图片 不知道修改哪一个 请手动处理` });
                return null;
            }
            const index = list.findIndex(m => m.type === MobileQQ_Android_type_图片);

            // 获取表情信息
            const eInfo = await getEmoticonInfo(_this);
            if (!eInfo) return null;
            const { packName, desc } = eInfo;

            // 修改表情 url
            const img = list[index];
            let url = img.data.imgUrl;
            if (!url) {
                url = await getEmoticonUrl(_this, packName);
                if (!url) return null;
            }

            const e = {
                type: MobileQQ_Android_type_自定义表情,
                html: `[${packName}-${desc}]`,
                data: {
                    webUrl: url,
                    packName,
                    desc,
                    mark: '', // mark 不填算了，如果要做的话，需要从 EmoticonPackage.json 中读取
                },
            };

            list[index] = e;

            msg.html = list.map(v => v.html).join('<br/>');
            msg.content = htmlToText(msg.html);

            // 修改 msg.type

            if (list.find(v => v.type === MobileQQ_Android_type_图片)) {
                msg.type = MobileQQ_Android_type_图片;
            } else if (list.find(v => v.type === MobileQQ_Android_type_自定义表情)) {
                msg.type = MobileQQ_Android_type_自定义表情;
            } else {
                msg.type = MobileQQ_Android_type_消息;
            }

            return msg;
        },
    },
    {
        filter: msg => is_MobileQQ_Android_type_图片(msg),
        label: '补图',
        fn: async msg => {
            const [errInput, url] = await _this.msgBoxPrompt({
                title: '输入图片文件名',
                message: './data/qq-android/image/manual/',
            });
            if (errInput || !url) {
                return null;
            }
            _.set(msg, '$MobileQQ.data.imgUrl', `./data/qq-android/image/manual/${url}`);
            return msg;
        },
    },
    {
        filter: msg => is_MobileQQ_Android_type_视频(msg),
        label: '补视频',
        fn: async msg => {
            const [errInput, url] = await _this.msgBoxPrompt({
                title: '输入视频文件名',
                message: './data/qq-android/video/manual/',
            });
            if (errInput || !url) {
                return null;
            }
            _.set(msg, '$MobileQQ.data.videoLocalUrl', `./data/qq-android/video/manual/${url}`);
            return msg;
        },
    },
];

async function getEmoticonInfo(_this) {
    const eReg = /^(.+)-(.+)$/;

    const [err, _eText] = await _this.msgBoxPrompt({
        title: '输入 [表情包名称-表情描述]',
        inputValidator: v => eReg.test(v),
    });
    const eText = _eText.trim();
    if (err || !eText) return null;

    const [, packName, desc] = eText.match(eReg);
    return { packName, desc };
}

async function getEmoticonUrl(_this, packName) {
    const [errInput, inputUrl] = await _this.msgBoxPrompt({
        title: '输入表情文件名',
        message: `./data/qq-android/emoticon/${packName}/{fileName}`,
    });
    if (errInput || !inputUrl) {
        return null;
    }
    return `./data/qq-android/emoticon/${packName}/${inputUrl}`;
}
