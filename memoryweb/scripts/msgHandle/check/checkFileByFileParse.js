const fs = require('fs-extra');
const path = require('path');

const { DIR_INPUT_MSG, DIR_OUTPUT_MSG_DATA_STATIC } = require('../../config');
const { getJSON } = require('../../utils/index');

const outDir = path.join(__dirname, '../../../public/json/fileNotExist/byFileParse/');
fs.emptyDirSync(outDir);

const jsonFiles = fs.readdirSync(DIR_INPUT_MSG);

// 没做完, 因为 fileParse 并不是通用属性 没啥意义

for (let i = 0; i < jsonFiles.length; i++) {
    const f = jsonFiles[i];
    if (!/\.json$/.test(f)) continue;
    const msgJson = getJSON(path.join(DIR_INPUT_MSG, f));
    const fileNotExist = [];
    msgJson.forEach(msg => {
        if (msg.fileParse) {
            const { url } = msg.fileParse;
            const _url = decodeURI(url);
            const src = path.join(DIR_OUTPUT_MSG_DATA_STATIC, _url);

            const f_exist = fs.existsSync(src);
            console.log(f_exist, src);
            if (!f_exist) {
                fileNotExist.push(msg);
            }
        }
    });

    if (fileNotExist.length > 0) {
        console.log('fileNotExist.length', fileNotExist.length);
        fs.writeFileSync(path.join(outDir, `/${f}.json`), JSON.stringify(fileNotExist, null, 4));
    }
}
