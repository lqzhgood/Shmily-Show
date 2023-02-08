const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const { makeInnerTextById } = require(path.join(__dirname, '../../src/common.js'));

const comment = require(path.join(__dirname, './comments.json'));
console.log('comment.length', comment.length);
comment.forEach(c => {
    const $ = cheerio.load(c.html, { decodeEntities: false }, false);

    Array.from($('a[innerLink]')).forEach(elm => {
        const { href } = elm.attribs;

        // 一定是 query 开头， 默认 hash 路由
        if (!href.startsWith('/#/query?')) {
            console.error(`评论内联链接-路由错误`, href);
            console.log('c', c);
            throw new Error(``);
        }

        // 一定有 id searchKey searchType 这三者之一的查询参数
        const q = new URLSearchParams(href.substring(8));
        const id = q.get('id');
        if (!id && !q.get('searchKey') && !q.get('searchType')) {
            console.log('评论内联链接-错误的参数', href);
            console.log('c', c);
            throw new Error('');
        }

        // 只检查ID search 不检查
        if (!id) return;

        $(elm).text(makeInnerTextById(id));
    });
    c.html = $.html().replaceAll('<p></p>', '');
});

console.log('comment.length', comment.length);
fs.writeFileSync(path.join(__dirname, './comment-fix.json'), JSON.stringify(comment, null, 4));
