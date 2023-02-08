const path = require('path');
const { DIR_WEB_CODE } = require('../config.js');
const cheerio = require('cheerio');

const { MATCH_ID_REG } = require(path.join(DIR_WEB_CODE, './common.js'));

exports.getInnerLinkId = function (elm) {
    const { innerlink, href } = elm.attribs;
    if (innerlink === undefined) {
        return false;
    }

    if (!href) return false;

    // 一定是 query 开头， 默认 hash 路由
    if (!href.startsWith('/#/query?')) {
        return false;
    }

    const q = new URLSearchParams(href.replace(/^\/#\/query/, ''));
    const id = q.get('id');

    return MATCH_ID_REG.test(id) ? id : false;
};

exports.htmlToText = function (html) {
    html = html.replaceAll('</tag>', '</tag><br/>');
    const $ = cheerio.load(html, { decodeEntities: false }, false);

    $('a:not([innerlink]):not([innersearch])').replaceWith((i, elm) => {
        const { href } = elm.attribs;
        const f = getUrlFile(href);
        const text = $(elm).text();
        if (!text.includes(f)) {
            return `<span>${f} ${text}</span>`;
        } else {
            return elm;
        }
    });

    $('video,audio').replaceWith((i, elm) => {
        const { src } = elm.attribs;
        return `<span>${getUrlFile(src)}</span>`;
    });

    $('img').replaceWith((i, elm) => {
        const { alt = '图', src } = elm.attribs;
        return `<span>[${alt}] ${getUrlFile(src)}</span>`;
    });
    $('br').replaceWith((i, elm) => {
        return `<span>\n</span>`;
    });
    return $.text();
};

function getUrlFile(url) {
    return decodeURIComponent(url.split('/').pop());
}
