const fs = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');

const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC } = require('../../../../config');
const { makeDate, findItemSource } = require('../../utils');
const { SOURCE_TYPE_CONTRAST, DIRECTION_TYPE_ALL } = require('../../../../../src/views/Statistic/const.js');

const outDir = path.join(
    DIR_OUTPUT_PUBLIC_JSON_STATISTIC,
    `./${SOURCE_TYPE_CONTRAST}/${DIRECTION_TYPE_ALL}/emotion/timeLine/`,
);
fs.mkdirpSync(outDir);

const { countEmotion } = require('./lib/index.js');

const { msgJsonAll } = require('../../const.js');

const timeLineRes = msgJsonAll.reduce(
    (pre, cV) => {
        const { year, month, day } = pre;

        const t = dayjs(cV.ms);
        const y = t.format('YYYY');
        const m = t.format('YYYY-MM');
        const d = t.format('YYYY-MM-DD');

        const infoArr = countEmotion(cV);
        const len = infoArr ? infoArr.length : 0;

        findItemSource(year, cV, v => v.date == y && v.source === cV.direction, len);
        findItemSource(month, cV, v => v.date == m && v.source === cV.direction, len);
        findItemSource(day, cV, v => v.date == d && v.source === cV.direction, len);

        return pre;
    },
    {
        year: makeDate(msgJsonAll, 'year', ['come', 'go']),
        month: makeDate(msgJsonAll, 'month', ['come', 'go']),
        day: makeDate(msgJsonAll, 'day', ['come', 'go']),
    },
);

fs.writeFileSync(path.join(outDir, 'year.json'), JSON.stringify(timeLineRes.year, null, 4));
fs.writeFileSync(path.join(outDir, 'month.json'), JSON.stringify(timeLineRes.month, null, 4));
fs.writeFileSync(path.join(outDir, 'day.json'), JSON.stringify(timeLineRes.day, null, 4));
