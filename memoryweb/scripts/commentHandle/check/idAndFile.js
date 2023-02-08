const _ = require('lodash');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const { getJSON, setJSON } = require('../../utils/index');
const { clearEmptyFolder } = require('../../utils/file');
const {
    DIR_WEB_CODE,
    FILE_OUTPUT_JSON_MSG,
    FILE_OUTPUT_COMMENTS,
    DIR_OUTPUT_MSG_DATA_STATIC,
    DIR_OUTPUT_COMMENT_STATIC,
} = require('../../config');

const msgAll = getJSON(FILE_OUTPUT_JSON_MSG);
const cArr = getJSON(FILE_OUTPUT_COMMENTS);

// eslint-disable-next-line
if (cArr.length === 0) return;

const { MATCH_ID_REG, makeInnerTextById } = require(path.join(DIR_WEB_CODE, './common.js'));

clearEmptyFolder(DIR_OUTPUT_COMMENT_STATIC);
const ALL_MSG_ID_IN_DIR = fs.readdirSync(DIR_OUTPUT_COMMENT_STATIC).filter(d => d !== 'face');

const ALL_MSG_ID_IN_COMMENT = [];

check(cArr);

// !!! 文件没法一一对应, 文件里面可能只写了一个 html 然后引用其他文件
// 检查文件数量是否一一对应
// const DIR_FILES = getAllFiles(DIR_OUTPUT_COMMENT_STATIC).filter(v => !v.includes('\\data\\comments\\face'));
// const uFiles = _.xor(_.uniq(C_FILES), DIR_FILES);
// console.log('uFiles', uFiles);

// 检查 文件夹名(id) 和 评论里的ID 是否一一对应
const ALL_MSG_ID_IN_COMMENT_uniq = _.uniq(ALL_MSG_ID_IN_COMMENT);

const D_ID_IN_COMMENT = _.difference(ALL_MSG_ID_IN_COMMENT_uniq, ALL_MSG_ID_IN_DIR);
if (D_ID_IN_COMMENT.length > 0) {
    console.log('评论中有多余ID未对应文件夹', D_ID_IN_COMMENT);
}
const D_ID_IN_DIR = _.difference(ALL_MSG_ID_IN_DIR, ALL_MSG_ID_IN_COMMENT_uniq);
if (D_ID_IN_DIR.length > 0) {
    console.log('评论中有多余的文件夹未对应ID', D_ID_IN_DIR);
}

setJSON(FILE_OUTPUT_COMMENTS, cArr);

function check(comments) {
    comments.forEach(c => {
        if (!c?.html) return;

        // c 上面的 msgId 已经在 make.js 中核实过了

        const $ = cheerio.load(c.html, { decodeEntities: false }, false);
        Array.from($('a')).forEach(elm => {
            const { innerlink, innersearch, innerstatistic, href } = elm.attribs;
            if (innerlink !== undefined) {
                checkInnerA($, c, elm);
            } else if (innersearch !== undefined || innerstatistic !== undefined) {
                // 内联搜索 内联页面
            } else if (/^\.{0,1}\/data\/comments\//.test(href)) {
                checkFile(href, c);
            } else {
                if (!href.startsWith('http')) {
                    console.log('评论内联链接 - 意外的链接', href);
                }
            }
        });

        Array.from($('[src]')).forEach(elm => {
            const { src } = elm.attribs;
            if (src.startsWith('/data/comments/')) {
                checkFile(src, c);
            }
        });
    });
}

function checkInnerA($, c, elm) {
    const { href } = elm.attribs;

    // 一定是 query 开头， 默认 hash 路由
    if (!href.startsWith('/#/query?')) {
        console.error('❌', `评论内联链接-路由错误`, href, c);
        throw new Error(``);
    }

    // 一定有 id searchKey searchType 这三者之一的查询参数
    const q = new URLSearchParams(href.replace(/^\/#\/query/, ''));
    const id = q.get('id');
    if (!id && !q.get('searchKey') && !q.get('searchType')) {
        console.log('❌', '评论内联链接-错误的参数', href, c);
        throw new Error('');
    }

    // 只检查ID search 不检查
    if (!id) return;

    matchId(id, c);
    // 检查内容
    const text = $(elm).text();
    if (text !== makeInnerTextById(id)) {
        console.error('内联链接的文本不正确', text, makeInnerTextById(id), c);
        throw new Error();
    }
}

function checkFile(link, c) {
    if (link.includes('/data/comments/face/')) return;

    const id = link.split('/').filter(v => v)[2];

    if (id !== c.msgId) {
        console.error('文件不在当前评论目录下', id, c);
        throw new Error();
    }

    matchId(id, c);
    ALL_MSG_ID_IN_COMMENT.push(id);

    const file = decodeURI(link).split('?').shift();
    const f = path.join(DIR_OUTPUT_MSG_DATA_STATIC, file);
    if (!fs.existsSync(f)) {
        console.log(`评论文件不存在 ${f}`, c);
        throw new Error();
    }
}

function matchId(id, c) {
    const find = msgAll.some(m => m.id === id);
    if (!find || !MATCH_ID_REG.test(id)) {
        console.error('在消息中没有找到评论 ID', id, c);
        throw new Error();
    }
}
function getAllFiles(f, arr = []) {
    if (!fs.statSync(f).isDirectory()) {
        arr.push(f);
    } else {
        const files = fs.readdirSync(f).map(_f => path.join(f, _f));

        for (let i = 0; i < files.length; i++) {
            const f_s = files[i];

            getAllFiles(f_s, arr);
        }
    }
    return arr;
}
