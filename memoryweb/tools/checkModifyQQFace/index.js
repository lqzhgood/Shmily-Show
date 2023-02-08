const fs = require('fs-extra');
const cheerio = require('cheerio');
const path = require('path');
const { findByFaceArr } = require('../../src/common.js');

const rModifyPath = '../../src/assets/data/modify.json';

const modifyJson = fs.readJsonSync(rModifyPath);
fs.copyFileSync(rModifyPath, `./modify_bak_${Date.now()}.json`);
// 检查 modify 全量 不做分割了

const QQ_FACE_ARR_PATH = path.join('../../../msgData/', '/data/qq-pc/face/', 'emojiMapByQQ.json');
const qqFaceArrJson = fs.readJsonSync(QQ_FACE_ARR_PATH);

// const a = findByFaceArr('f63d7f4a091e14e9a9cd773078488c94', qqFaceArrJson);
// const { dir } = path.parse('./data/qq-pc/face/小黄人/52fbcd975f0e75e2859be74f7ae52c9c.png');
// console.log('dir');

modifyJson
    .filter(v => v.type === 'modify')
    .forEach(({ type, oMsg, nMsg }) => {
        // oMsg 反正要被替换的就不管了 而且修改 oMsg 会改变原始 id 所以不要修改

        // QQ 可能修改了 emojiMapByQQ.json， 但 modify 中未修改需要检查
        if (nMsg.source !== 'QQ') return;

        const $ = cheerio.load(nMsg.html, { decodeEntities: false }, false);
        let modifyCount = 0;

        Array.from($('img')).forEach(img => {
            const { src, alt, title } = img.attribs;
            const isFace = src.includes('/qq-pc/face/');

            if ((alt || title) && alt !== title) {
                // 这里是前期有 AlT 没补充 TITLE 的
                if (alt && !title && isFace) {
                    img.attribs.title = img.attribs.alt;
                } else {
                    console.log('❌', nMsg.id, src, alt, title);
                    throw new Error('Modify Img Title not same as ALT');
                }
            }

            if (!isFace) return;

            const { name: md5, ext: ext_img, dir } = path.parse(src);
            const img_type = dir.split('/').slice(-1)[0];

            const { face, file } = findByFaceArr(md5, qqFaceArrJson);
            if (!face) {
                console.log('❌', '没有找到表情', src);
                throw new Error('');
            }

            if (alt !== `${face.type}-${face.alt}`) {
                modifyCount++;
                console.log('❌', 'Alt 不符 自动修复', alt, `${face.type}-${face.alt}`);
                img.attribs.alt = `${face.type}-${face.alt}`;
                img.attribs.title = `${face.type}-${face.alt}`;
            }

            if (md5 !== file.md5 || ext_img !== file.ext || img_type !== face.type) {
                modifyCount++;
                console.log(
                    '❌',
                    'Src 不符 自动修复',
                    `${img_type}/${md5}${ext_img}`,
                    `${face.type}/${file.md5}${file.ext}`,
                );
                img.attribs.src = `./data/qq-pc/face/${face.type}/${file.md5}${file.ext}`;
            }
        });
        if (modifyCount > 0) {
            nMsg.html = $.html();
            nMsg.content = htmlToText(nMsg.html);
        }
    });

fs.writeFileSync(rModifyPath, JSON.stringify(modifyJson, null, 4));

function htmlToText(html) {
    const $ = cheerio.load(html, { decodeEntities: false });
    $('img').replaceWith((i, elm) => {
        const { alt } = elm.attribs;
        return `<span>${alt ? `[${alt}]` : '[图]'}</span>`;
    });
    $('br').replaceWith((i, elm) => {
        return `<span>\n</span>`;
    });

    return $.text();
}
