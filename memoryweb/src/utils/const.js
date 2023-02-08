const _ = require('lodash');

const { MATCH_ID_REG: _MATCH_ID_REG, makeInnerTextById } = require('../common.js');

const { loadingTexts } = require('@/config.js');

export const FORMAT_TIME = 'YYYY-MM-DD HH:mm:ss';
export const FORMAT_TIME_URL = 'YYYY-MM-DD_HH-mm-ss';

// 与 server @/utils/const.js 中的一致
export const EXT_IMAGE = ['.jpeg', '.jpg', '.png', '.gif', '.webp'];
export const EXT_VIDEO = ['.m4a', '.mp4', '.webm', '.mov'];
export const EXT_AUDIO = ['.wav', '.mp3'];

export const COLOR_PLATE = [
    '#5B8FF9',
    '#5AD8A6',
    '#5D7092',
    '#F6BD16',
    '#E8684A',
    '#6DC8EC',
    '#9270CA',
    '#FF9D4D',
    '#269A99',
    '#FF99C3',
];

const _color_common = `padding: 1px 8px;`;
const _color_common_left = `${_color_common} border-bottom-left-radius: 4px; border-top-left-radius: 4px;`;
const _color_common_right = `${_color_common} border-bottom-right-radius: 4px; border-top-right-radius: 4px;`;

// Loading 显示文本 随机抽
export const LOADING_TEXT = new Proxy(loadingTexts, {
    get(target, key) {
        if (key == 'value') {
            return target ? target[_.random(0, target.length - 1)] : '载入中...';
        }
        return undefined;
    },
});

export const CONSOLE_STYLE = {
    info(t, s = '') {
        console.log(
            `%c${t}%c${s}`,
            `${_color_common_left} background-color: #0c4299;  color: #f8f9fa;`,
            `${_color_common_right} background-color: #ed9a14;  color: #f8f9fa; `,
        );
    },
    success(t, s = '') {
        console.log(
            `%c${t}%c${s}`,
            `${_color_common_left} background-color: #52c41a;  color: #fff;`,
            `${_color_common_right} background-color: #bae637;  color: rgba(0, 0, 0, 0.85); `,
        );
    },
    warning(t, s = '') {
        console.log(
            `%c${t}%c${s}`,
            `${_color_common_left} background-color: #e6a23c;  color: #fff;`,
            `${_color_common_right} background-color: #fdf6ec;  color: #e6a23c;`,
        );
    },
    danger(t, s = '') {
        console.log(
            `%c❌ ${t}%c${s}`,
            `${_color_common_left} background-color: #f56c6c;  color: #fff;`,
            `${_color_common_right} background-color: #fef0f0;  color: #f56c6c;`,
        );
    },
};

export const REPLACE_KEY = '######';

export function makeUrlQueryUrlById(id, resolve = true) {
    return resolve ? `${window.location.origin}/#/query?id=${id}` : `/#/query?id=${id}`;
}

export function makeUrlCommentFile(id, fileName, resolve = true) {
    return resolve ? `${window.location.origin}/data/comments/${id}/${fileName}` : `/data/comments/${id}/${fileName}`;
}

// !!! 弃用
//msg-qq-pc.json_2012-04-19_19-58-00_ee46a5_1
export const MATCH_OLD_OLD_ID_REG = /\.json_(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})_[A-Za-z0-9]{6}_\d{1,2}$/;

// !!! 弃用
//msg-qq-pc.json_2012-04-19_19-58-00_c_02d173_ee46a5_1
export const MATCH_ID_OLD_REG =
    /\.json_(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})_[c|g]_[A-Za-z0-9]{6}_[A-Za-z0-9]{6}_\d{1,2}$/;

export const MATCH_ID_REG = _MATCH_ID_REG;

// 内部页面
// export function TMPL_HTML_COMMENT_PAGE(p, text = p, attrs = '') {
//     if (!p.startsWith('/')) {
//         p = '/' + p;
//     }
//     return;
// }

export function TMPL_HTML_COMMENT_PAGE_STATISTIC(type, text = type, attrs = '') {
    return `<a innerstatistic target="_blank" href="/#/statistic/${type}" ${attrs}>统计:${text}</a>`;
}

// html 属性无大小写区分, 全小写兼容性更高
export function TMPL_HTML_COMMENT_INNER_SEARCH(searchType, searchKey, attrs = '') {
    return `<a innersearch target="_blank" href="/#/query?searchType=${searchType}&searchKey=${encodeURIComponent(
        searchKey,
    )}" ${attrs}>${searchType}:${searchKey}</a>`;
}

// html 属性无大小写区分, 全小写兼容性更高
export function TMPL_HTML_COMMENT_INNER_LINK(id, text, attrs = '') {
    return `<a innerlink target="_blank" href="/#/query?id=${encodeURIComponent(id)}" ${attrs}>${
        text || makeInnerTextById(id) // 2017-10-05 13:02:56
    }</a>`;
}

export function TMPL_VNODE_COMMENT_INNER_LINK_ID_POPOVER(id) {
    return `<el-popover placement="left" trigger="hover" max-width="340">
                <MsgPopover :msgId="'${id}'" />
                ${TMPL_HTML_COMMENT_INNER_LINK(id, undefined, "slot='reference'")}
            </el-popover>`;
}

// 尽量不要 encodeURIComponent , 因为这样会导致 url 很难看
// 所以 comment add file 以后会强制打开一次 url 如果打不开 404， 则文件名包含 encode 特殊字符 需要去掉
export function TMPL_HTML_COMMENT_FILE(id, fileName) {
    return `<p><a target="_blank" href="/data/comments/${id}/${fileName}">${fileName}</a></p>`;
}
export function TMPL_HTML_COMMENT_IMG(id, fileName) {
    return `<div class="align-center"><img src="/data/comments/${id}/${fileName}" /></div>`;
}
export function TMPL_HTML_COMMENT_VIDEO(id, fileName) {
    return `<div class="align-center"><video controls src="/data/comments/${id}/${fileName}" ></video></div>`;
}
export function TMPL_HTML_COMMENT_AUDIO(id, fileName) {
    return `<div class="align-center"><audio controls src="/data/comments/${id}/${fileName}" ></audio></div>`;
}

export function TMPL_HTML_MSG_QQ_VIDEO(videoFile, imgFile) {
    const vStr = videoFile ? `src="/data/qq-pc/video/${videoFile}"` : '';
    const iStr = imgFile ? `poster="/data/qq-pc/video/${imgFile}"` : '';

    return `<video controls ${vStr} ${iStr} ></video>`;
}

export function QQ_MAP_LOCATION_API(title, content, lat, lng) {
    title = encodeURIComponent(title);
    content = encodeURIComponent(content);
    return `https://apis.map.qq.com/uri/v1/marker?marker=coord:${lat},${lng};title:${title};addr:${content}&referer=memoryweb`;
}

// 百度奇怪的bug，[title=LGE Nexus 5&content=2013-12-25 19:38:25 无法跳转] title content 前后加上 _ 就可以了
// 2022-02-26 22:45 给百度提了  issues ,已修复

// 百度地图 bug2 无法打开南半球标注点 已提交 issues 未答复
// 2022-10-18 百度回复暂不支持 0° 以下坐标...

export function BAIDU_MAP_LOCATION_API(title, content, lat, lng, coord_type = 'wgs84', output = 'html') {
    title = encodeURIComponent(title);
    content = encodeURIComponent(content);
    return `https://api.map.baidu.com/marker?location=${lat},${lng}&title=${title}&content=${content}&output=${output}&coord_type=${coord_type}&src=memoryweb`;
}

export const CONST_SEARCH_TYPE_MSG = '消息';
export const CONST_SEARCH_TYPE_COMMENT = '评论';
