const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const { FILE_OUTPUT_JSON_MSG_ORIGINAL, DIR_INPUT_MSG } = require('../../config');
const { getJSON, setJSON } = require('../../utils/index');
const { MSG_SLICE } = require('../../../src/common');

const jsonFiles = fs
    .readdirSync(DIR_INPUT_MSG)
    .filter(v => v.toLowerCase().endsWith('.json'))
    .sort();

console.log('✔️', 'All File', jsonFiles);

let result = [];

for (let i = 0; i < jsonFiles.length; i++) {
    const f = jsonFiles[i];
    if (!/\.json$/.test(f)) continue;
    const j = getJSON(path.join(DIR_INPUT_MSG, f));
    result = result.concat(j);
}

const sort = MSG_SLICE ? _.sortBy(result, 'ms').slice(MSG_SLICE.S, MSG_SLICE.E) : _.sortBy(result, 'ms');
console.log(
    '✔️',
    'Merger Length',
    sort.length,
    `${sort[0].day} ${sort[0].time}`,
    `${sort.slice(-1)[0].day} ${sort.slice(-1)[0].time}`,
);

/**
 * @name:  这里写原始文件
 * @description:
 * @param {*}
 * @return {*}
 */
setJSON(FILE_OUTPUT_JSON_MSG_ORIGINAL, sort);
// fs.writeFileSync(FILE_OUTPUT_JSON_MSG_ORIGINAL, JSON.stringify(sort));
