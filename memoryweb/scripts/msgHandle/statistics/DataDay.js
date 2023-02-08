const fs = require('fs-extra');
const path = require('path');

const { SOURCE_TYPE_TOTAL, DIRECTION_TYPE_ALL } = require('../../../src/views/Statistic/const.js');

const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC } = require('../../config');
const { ALL_SOURCE, msgJsonAll } = require('./const.js');
const { countDataDay } = require('./utils/dataDay.js');

calc();

function calc() {
    const data_all = countDataDay(msgJsonAll.map(v => v.ms));
    fs.writeFileSync(
        path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_TOTAL}/${DIRECTION_TYPE_ALL}/data-day.json`),
        JSON.stringify(data_all, null, 4),
    );

    ALL_SOURCE.forEach(s => {
        const data = countDataDay(msgJsonAll.filter(m => m.source === s).map(v => v.ms));
        fs.writeFileSync(
            path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${s}/${DIRECTION_TYPE_ALL}/data-day.json`),
            JSON.stringify(data, null, 4),
        );
    });
}
