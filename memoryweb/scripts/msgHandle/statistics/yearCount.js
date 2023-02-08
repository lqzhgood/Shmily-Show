const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC } = require('../../config');
const { addDirection, coverToCountYear } = require('./utils/index.js');

const {
    SOURCE_TYPE_TOTAL,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
} = require('../../../src/views/Statistic/const.js');

const { msgJsonAll, msgJsonCome, msgJsonGo, ALL_SOURCE, ALL_YEAR } = require('./const.js');

console.time('countYear');
calc(msgJsonAll, DIRECTION_TYPE_ALL);
calc(msgJsonCome, DIRECTION_TYPE_COME);
calc(msgJsonGo, DIRECTION_TYPE_GO);
console.timeEnd('countYear');

function calc(calcArr, directionType) {
    const countYear = makeCount(calcArr, SOURCE_TYPE_TOTAL);

    fs.writeFileSync(
        path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_TOTAL}/${directionType}/year-count.json`),
        JSON.stringify(countYear, null, 4),
    );

    ALL_SOURCE.forEach(s => {
        const msgSource = calcArr.filter(v => v.source == s);
        const sCount = makeCount(msgSource, s);
        fs.writeFileSync(
            path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${s}/${directionType}/year-count.json`),
            JSON.stringify(sCount, null, 4),
        );
    });
}

function makeCount(arr, source) {
    const res = arr.reduce((pre, cV) => {
        const t = dayjs(cV.ms);
        const d = t.format('YYYY-MM-DD');
        let find = pre.find(v => v.date == d);
        if (!find) {
            find = {
                date: d,
                count: 0,
            };
            pre.push(find);
        }

        find.count++;
        addDirection(find, cV);

        return pre;
    }, []);
    // 这里-年

    const yearCountData = coverToCountYear(res, ALL_YEAR, source);

    return yearCountData;
}
