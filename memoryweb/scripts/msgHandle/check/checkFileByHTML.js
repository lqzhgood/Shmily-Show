const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const { DIR_INPUT_MSG, DIR_OUTPUT_MSG_DATA_STATIC } = require('../../config');
const { getJSON } = require('../../utils/index');

const outDir = path.join(__dirname, '../../../public/json/fileNotExist/byHtml/');
fs.emptyDirSync(outDir);

const jsonFiles = fs.readdirSync(DIR_INPUT_MSG);

for (let i = 0; i < jsonFiles.length; i++) {
    const f = jsonFiles[i];
    if (!/\.json$/.test(f)) continue;
    const msgJson = getJSON(path.join(DIR_INPUT_MSG, f));
    const fileNotExist = [];
    msgJson.forEach(msg => {
        if (msg.source == 'Email') return;
        if (!msg.html) return;
        const srcArr = msg.html.match(/(href|src)=["|'](.*?)["|']/gim);
        if (!srcArr) return;
        srcArr.forEach(s => {
            const u = s.replace(/^(href|src)=["|']/, '').replace(/["|']$/, '');
            const p = path.join(DIR_OUTPUT_MSG_DATA_STATIC, decodeURI(u));
            const f_exist = fs.existsSync(p);
            if (!f_exist) {
                fileNotExist.push([`${msg.day} ${msg.time}`, p]);
            }
        });
    });
    if (fileNotExist.length > 0)
        fs.writeFileSync(path.join(outDir, `/${f}.json`), JSON.stringify(_.sortBy(fileNotExist, '1'), null, 4));
}
