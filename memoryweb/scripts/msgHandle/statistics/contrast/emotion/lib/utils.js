const cheerio = require('cheerio');
const { SAME_FACE } = require('../config.js');

function countEmotionByHtml(html, baseUrl) {
    const $ = cheerio.load(html, { decodeEntities: false }, false);

    const elms = $('img');

    const res = Array.from(elms)
        .map(elm => {
            const { src, alt, title } = elm.attribs;
            if (!src && !alt && !title) return null;

            if ((alt || title) && !src) {
                console.log('elm.attribs', elm.attribs);
                throw new Error('有 alt 和 title 没 src 不知道是不是表情');
            }

            if (src && src.includes(baseUrl)) {
                const [packName, des] = (alt || title).split('-');
                return {
                    packName,
                    des,
                    url: src,
                };
            }
            return null;
        })
        .filter(v => v);
    return res;
}

function isSameMd5(md5) {
    // const f = SAME_FACE.find(v => v.o === md5);
    // return f ? f.n : md5;
    // 反正最终对比的是 des 的 count ,文件的 count 合并貌似没必要
    return md5;
}

module.exports = {
    countEmotionByHtml,
    isSameMd5,
};
