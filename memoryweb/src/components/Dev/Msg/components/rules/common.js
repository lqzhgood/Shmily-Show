import { getClipboardContents, htmlToText } from '@/utils/index.js';

export default _this => [
    {
        label: 'fillContentByClip',
        des: '从剪贴板填充 html 和 content 字段',
        fn: async msg => {
            const clipText = await getClipboardContents();
            msg.content = clipText;
            msg.html = clipText;
            return msg;
        },
    },
    {
        label: 'HtmlToContent',
        des: '将当前 html 字段内容格式化填充 content 字段',
        fn: (msg, msgModify) => {
            if (!msgModify) return null; // 如果 msgModify 为 "" 说明，Msg JSON 格式不对

            const text = htmlToText(msgModify.html);
            msgModify.content = text;

            return msgModify;
        },
    },
    {
        label: '文件',
        des: '修改 type 为 [文件], 填充 [文件名] 为 html 和 content 字段',
        fn: async msg => {
            const [errInput, fileInfo] = await _this.msgBoxPrompt({
                title: '输入文件信息',
            });

            if (errInput) return null;

            msg.type = '文件';
            msg.html = fileInfo;
            msg.content = fileInfo;
            return msg;
        },
    },
];
