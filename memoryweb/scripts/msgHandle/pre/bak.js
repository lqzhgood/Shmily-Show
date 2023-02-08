const fs = require('fs-extra');
const path = require('path');

const { DIR_INPUT_MSG } = require('../../config');
const DIR_INPUT_MSG_BAK = path.join(DIR_INPUT_MSG, './bak');
fs.mkdirpSync(DIR_INPUT_MSG_BAK);

const jsonFiles = fs.readdirSync(DIR_INPUT_MSG);

for (let i = 0; i < jsonFiles.length; i++) {
    const f = jsonFiles[i];
    if (!/\.json$/.test(f)) continue;
    const jsonFilePath = path.join(DIR_INPUT_MSG, f);
    bakFile(f, jsonFilePath);
}

function bakFile(fileName, p) {
    const f_bak = path.join(DIR_INPUT_MSG_BAK, fileName);
    if (!fs.existsSync(f_bak)) {
        fs.copySync(p, f_bak, {
            preserveTimestamps: true,
        });
    }
}
