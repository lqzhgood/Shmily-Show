const cheerio = require('cheerio');

function countWordByHtml(html, ignore = []) {
    const $ = cheerio.load(html, { decodeEntities: false }, false);
    let s = $.text();

    for (let i = 0; i < ignore.length; i++) {
        const igs = ignore[i];
        s = s.replaceAll(igs, '');
    }

    return s.length;
}

// const x = countWordByHtml(`<h4>恭喜发财，大吉大利！2</h4>`, ['恭喜发财，大吉大利！']);
// console.log('x', x);

module.exports = {
    countWordByHtml,
};
