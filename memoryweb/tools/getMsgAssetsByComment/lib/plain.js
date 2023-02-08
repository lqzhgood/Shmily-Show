const cheerio = require('cheerio');
const { copy } = require('../utils.js');

function plain(m) {
    const $ = cheerio.load(m.html, { decodeEntities: false }, false);

    Array.from($('video')).forEach(elm => {
        const { src, poster } = elm.attribs;
        if (src) copy(m, src);
        if (poster) copy(m, poster);
    });

    Array.from($('audio')).forEach(elm => {
        const { src } = elm.attribs;
        if (src) copy(m, src);
    });

    Array.from($('img')).forEach(elm => {
        const { src } = elm.attribs;
        if (src) copy(m, src);
    });
}

module.exports = {
    plain,
};
