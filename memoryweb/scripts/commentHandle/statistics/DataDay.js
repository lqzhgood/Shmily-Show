const fs = require('fs-extra');
const path = require('path');

const { SOURCE_TYPE_EDIT, DIRECTION_TYPE_ALL } = require('../../../src/views/Statistic/const.js');

const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC } = require('../../config');
const { commentsAll } = require('./const.js');
const { countDataDay } = require('../../msgHandle/statistics/utils/dataDay.js');

// eslint-disable-next-line
if (commentsAll.length === 0) return;

calc();

function calc() {
    const data_all = countDataDay(commentsAll.map(v => v.ms));
    const outDir = path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_EDIT}/${DIRECTION_TYPE_ALL}/`);
    fs.mkdirpSync(outDir);
    fs.writeFileSync(path.join(outDir, 'comment-data-day.json'), JSON.stringify(data_all, null, 4));
}
