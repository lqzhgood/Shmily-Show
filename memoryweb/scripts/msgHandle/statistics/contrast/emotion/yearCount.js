const fs = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC } = require('../../../../config');

const { addDirection, coverToCountYear } = require('../../utils/index.js');

const {
    SOURCE_TYPE_TOTAL,
    SOURCE_TYPE_CONTRAST,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
} = require('../../../../../src/views/Statistic/const.js');

const { msgJsonAll, msgJsonCome, msgJsonGo, ALL_YEAR } = require('../../const.js');

const { countEmotion } = require('./lib/index.js');

console.time('countYear-emotions');
calc(msgJsonAll, DIRECTION_TYPE_ALL);
calc(msgJsonCome, DIRECTION_TYPE_COME);
calc(msgJsonGo, DIRECTION_TYPE_GO);

console.timeEnd('countYear-emotions');

function calc(calcArr, directionType) {
    const countYear = makeCount(calcArr);
    const outDir = path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_CONTRAST}/${directionType}/emotion/`);
    fs.mkdirpSync(outDir);

    fs.writeFileSync(path.join(outDir, `./year-count.json`), JSON.stringify(countYear, null, 4));
}

function makeCount(arr) {
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

        const infoArr = countEmotion(cV);
        const len = infoArr ? infoArr.length : 0;

        find.count += len;
        addDirection(find, cV, len);

        return pre;
    }, []);
    // 这里-年
    const yearCountData = coverToCountYear(res, ALL_YEAR, SOURCE_TYPE_TOTAL);

    return yearCountData;
}
