const cheerio = require('cheerio');
const path = require('path');

const { MATCH_ID_REG } = require(path.join(__dirname, '../../src/common.js'));

const comment = require(path.join(__dirname, './comments.json'));

comment.forEach(c => {
    const $ = cheerio.load(c.html, { decodeEntities: false }, false);

    Array.from($('a')).forEach(elm => {
        const { href } = elm.attribs;

        const id = href.split('/').filter(v => v)[2];
        const _id = href.split('/').filter(v => v)[3];

        if (MATCH_ID_REG.test(id) && MATCH_ID_REG.test(_id)) {
            console.count('x');
        }
    });
});
