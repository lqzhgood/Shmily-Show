const fs = require('fs-extra');
const path = require('path');

const { DIR_INPUT_MSG } = require('../../config');

const { getJSON, setJSON } = require('../../utils/index');

const jsonFiles = fs.readdirSync(DIR_INPUT_MSG);

for (let i = 0; i < jsonFiles.length; i++) {
    const f = jsonFiles[i];
    if (!/\.json$/.test(f)) continue;
    const jsonFilePath = path.join(DIR_INPUT_MSG, f);
    const json = getJSON(jsonFilePath);
    setJSON(jsonFilePath, json, 'file');
}
