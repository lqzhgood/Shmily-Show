const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const cheerio = require('cheerio');

const msgOriginalDir = path.join(__dirname, '../../src/assets/data/msg/');

const list = [];

fs.readdirSync(msgOriginalDir).forEach(_f => {
    const f = path.join(msgOriginalDir, _f);
    if (fs.statSync(f).isDirectory()) return;

    readJson(f).forEach(v => {
        if (!v.html) return;
        const $ = cheerio.load(v.html, { decodeEntities: false }, null);
        const imgs = $('img');
        Array.from(imgs).forEach(img => {
            const { src, alt, title } = img.attribs;
            if (alt && !title) {
                list.push(_f);
                if (_f == 'email.json') console.log(alt);
            }
        });
    });
});

console.log(Array.from(new Set(list)));

function readJson(p) {
    return JSON.parse(fs.readFileSync(p));
}
