import { Message, MessageBox } from 'element-ui';

import {
    MATCH_ID_REG,
    makeUrlCommentFile,
    TMPL_HTML_COMMENT_INNER_LINK,
    TMPL_HTML_COMMENT_FILE,
    TMPL_HTML_COMMENT_IMG,
    TMPL_HTML_COMMENT_VIDEO,
    TMPL_HTML_COMMENT_AUDIO,
} from '@/utils/const';
import { openWin, getClipboardContents, replaceSpecialKeyInStrToRegExp } from '@/utils/index.js';
import {
    EXT_IMAGE,
    EXT_VIDEO,
    EXT_AUDIO,
    CONST_SEARCH_TYPE_MSG,
    CONST_SEARCH_TYPE_COMMENT,
    TMPL_HTML_COMMENT_INNER_SEARCH,
    TMPL_HTML_COMMENT_PAGE_STATISTIC,
} from '@/utils/const.js';

export default (_this, sId, k) => [
    {
        label: 'a-page-statistic',
        fn: async () => {
            const [err, type] = await _this.msgBoxPrompt({
                title: '请输入统计子页面',
            });
            if (err || !type.trim()) return;

            const html = TMPL_HTML_COMMENT_PAGE_STATISTIC(type);
            _this.insertComment(html);
            Message({ type: 'success', message: '成功' });
        },
    },
    {
        label: 'a-query',
        key: 'q',
        fn: async () => {
            // 完整 HTML 格式匹配
            const matchStr = TMPL_HTML_COMMENT_INNER_LINK('__id__', '__day__');
            const fullRegStr = replaceSpecialKeyInStrToRegExp(matchStr)
                .replace('__id__', MATCH_ID_REG.toString().replace(/(^\/|\$\/$)/g, '')) // 去掉正则的首尾开始符号 //
                .replace('__day__', `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}`); //2017-10-05 13-02-56
            const fullReg = new RegExp(fullRegStr);

            const clipText = await getClipboardContents();
            let str;

            if (fullReg.test(clipText)) {
                str = clipText;
            } else if (MATCH_ID_REG.test(clipText)) {
                str = idToHtml(clipText);
            } else {
                const [err, value] = await _this.msgBoxPrompt({
                    title: '请输入 [id]',
                    inputPattern: MATCH_ID_REG,
                    inputErrorMessage: 'id 格式不正确',
                });
                if (err) return;
                str = idToHtml(value);
            }

            _this.insertComment(str);
            Message({ type: 'success', message: '成功' });

            function idToHtml(id) {
                return TMPL_HTML_COMMENT_INNER_LINK(id);
            }
        },
    },
    {
        label: 'a-search',
        key: 's',
        des: '搜索内容',
        fn: async () => {
            let searchType;
            try {
                await MessageBox.confirm('', '搜索类型选择', {
                    confirmButtonText: CONST_SEARCH_TYPE_MSG,
                    cancelButtonText: CONST_SEARCH_TYPE_COMMENT,
                    distinguishCancelAndClose: true,
                });
                searchType = CONST_SEARCH_TYPE_MSG;
            } catch (error) {
                // cancel 是取消(cancelButtonText)按钮 值为 CONST_SEARCH_TYPE_COMMENT
                if (error === 'cancel') {
                    searchType = CONST_SEARCH_TYPE_COMMENT;
                } else {
                    // 如果是 esc 关闭 则 return 中止
                    return;
                }
            }

            const [err, searchKey] = await _this.msgBoxPrompt({
                title: '请输入搜索内容',
            });
            if (err) return;
            const str = TMPL_HTML_COMMENT_INNER_SEARCH(searchType, searchKey);
            _this.insertComment(str);
            Message({ type: 'success', message: '成功' });
        },
    },
    {
        label: 'a-file',
        key: 'f',
        // 为了绑定 this 到 vue，这样才能自动注入 const h = this.$createElement
        fn: async () => {
            const files = await _this.getFiles();

            // 自动填充排除 媒体 文件
            const fileArr = files.filter(
                f => ![...EXT_IMAGE, ...EXT_VIDEO, ...EXT_AUDIO].includes('.' + f.split('.').pop().toLowerCase()),
            );
            let fileName;
            if (fileArr.length === 1) {
                fileName = fileArr[0];
            } else {
                const [err, value] = await _this.msgBoxPrompt({
                    message: _this.msgBoxListVNode(files),
                    title: '请输入 [文件] 名',
                    inputValidator: v => !MATCH_ID_REG.test(v),
                    inputErrorMessage: '你输入的是 [id]， 此处应该是文件名',
                });
                if (err) return;
                fileName = value;
            }

            const str = TMPL_HTML_COMMENT_FILE(sId, fileName);
            _this.insertComment(str, str, 'end');
            openWin(makeUrlCommentFile(sId, fileName));
        },
    },
    {
        label: 'img',
        fn: async () => {
            const files = await _this.getFiles();
            const fileArr = files.filter(f => EXT_IMAGE.includes('.' + f.split('.').pop().toLowerCase()));

            let fileName;
            if (fileArr.length === 1) {
                fileName = fileArr[0];
            } else {
                const [err, value] = await _this.msgBoxPrompt({
                    message: _this.msgBoxListVNode(files),
                    title: '请输入 [图片] 文件名',
                });
                if (err) return;
                fileName = value;
            }

            const str = TMPL_HTML_COMMENT_IMG(sId, fileName);
            _this.insertComment(str, str, 'end');
        },
    },
    {
        label: 'video',
        fn: async () => {
            const files = await _this.getFiles();
            const fileArr = files.filter(f => EXT_VIDEO.includes('.' + f.split('.').pop().toLowerCase()));

            let fileName;
            if (fileArr.length === 1) {
                fileName = fileArr[0];
            } else {
                const [err, value] = await _this.msgBoxPrompt({
                    message: _this.msgBoxListVNode(files),
                    title: '请输入 [视频] 文件名',
                });
                if (err) return;
                fileName = value;
            }

            const str = TMPL_HTML_COMMENT_VIDEO(sId, fileName);
            _this.insertComment(str, str, 'end');
        },
    },
    {
        label: 'audio',
        fn: async () => {
            const files = await _this.getFiles();
            const fileArr = files.filter(f => EXT_AUDIO.includes('.' + f.split('.').pop().toLowerCase()));

            let fileName;
            if (fileArr.length === 1) {
                fileName = fileArr[0];
            } else {
                const [err, value] = await _this.msgBoxPrompt({
                    message: _this.msgBoxListVNode(files),
                    title: '请输入 [音频] 文件名',
                });
                if (err) return;
                fileName = value;
            }

            const str = TMPL_HTML_COMMENT_AUDIO(sId, fileName);
            _this.insertComment(str, str, 'end');
        },
    },
    {
        label: 'hr',
        str: '<hr/>',
    },
    {
        label: 'p',
    },
    {
        label: 'b',
    },
    {
        label: 'i',
    },
    {
        label: 'div-ref',
        str: `<div class="reference">${k}</div>`,
    },
    {
        label: 'div-center',
        str: `<div class="align-center">${k}</div>`,
    },
    {
        label: 'c-center',
        str: `align-center`,
        type: 'success',
    },
    {
        label: 'TODO',
        str: `<p>TODO</p>`,
        type: 'danger',
    },
];
