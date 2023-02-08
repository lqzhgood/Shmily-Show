const fs = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');

const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC } = require('../../../../config');
const {
    SOURCE_TYPE_CONTRAST,
    DIRECTION_TYPE_ALL,
    COUNT_DB_TYPE_NUM,
    COUNT_DB_TYPE_WORDS,
} = require('../../../../../src/views/Statistic/const');
const { makeDate, findItemSource, sortByArr } = require('../../utils');
const { countWord } = require('./lib/index.js');

const { msgJsonAll, ALL_SOURCE } = require('../../const.js');

const countSourceArr = sortByArr(['Email', 'Wechat', 'QQ', 'MobileQQ', 'SMS'], ALL_SOURCE);

console.time('countMsgWords');
calc(msgJsonAll, DIRECTION_TYPE_ALL, COUNT_DB_TYPE_NUM);

calc(msgJsonAll, DIRECTION_TYPE_ALL, COUNT_DB_TYPE_WORDS);
console.timeEnd('countMsgWords');

function calc(calcArr, directionType, countType) {
    const outDir = path.join(
        DIR_OUTPUT_PUBLIC_JSON_STATISTIC,
        `./${SOURCE_TYPE_CONTRAST}/${directionType}/${countType}/timeLine-words/`,
    );
    fs.mkdirpSync(outDir);

    const TimeLineWordRes = calcArr.reduce(
        (pre, cV) => {
            if (!countSourceArr.includes(cV.source)) return pre;

            const { year, month, day } = pre;

            const t = dayjs(cV.ms);
            const y = t.format('YYYY');
            const m = t.format('YYYY-MM');
            const d = t.format('YYYY-MM-DD');

            const len = countType === COUNT_DB_TYPE_NUM ? 1 : countWord(cV);

            if (!len || len == 0) return pre;

            const findY = findItemSource(year, cV, v => v.date == y && v.source === cV.direction, len);

            const findM = findItemSource(month, cV, v => v.date == m && v.source === cV.direction, len);

            const findD = findItemSource(day, cV, v => v.date == d && v.source === cV.direction, len);

            return pre;
        },
        {
            year: makeDate(msgJsonAll, 'year', ['come', 'go']),
            month: makeDate(msgJsonAll, 'month', ['come', 'go']),
            day: makeDate(msgJsonAll, 'day', ['come', 'go']),
        },
    );

    fs.writeFileSync(path.join(outDir, 'year.json'), JSON.stringify(TimeLineWordRes.year, null, 4));
    fs.writeFileSync(path.join(outDir, 'month.json'), JSON.stringify(TimeLineWordRes.month, null, 4));
    fs.writeFileSync(path.join(outDir, 'day.json'), JSON.stringify(TimeLineWordRes.day, null, 4));
}
