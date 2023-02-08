const cArr = require('../../src/assets/data/msg/bak/camera.json');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

for (let i = 0; i < cArr.length; i++) {
    const c = cArr[i];
    const $ = cheerio.load(c.html);
    const src = decodeURI($('[src]')[0].attribs.src);
    const { ext, name, dir } = path.parse(src);
    const file1 = path.join('C:/Shmily/Tool/Show/msgData/', src);
    const file2 = path.join('C:/Shmily/Tool/Show/msgData/', dir, name + '___IS_NEED_DELETE___' + ext);

    if (!fs.existsSync(file1) && !fs.existsSync(file2)) {
        console.log('src', src);
        console.log('file1', file1);
        console.log('file2', file2);
        console.log('');
    }
}

console.log('cArr.length', cArr.length);
