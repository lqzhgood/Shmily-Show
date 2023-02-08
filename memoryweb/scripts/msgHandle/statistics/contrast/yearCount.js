const fs = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC } = require('../../../config');

const { addDirection, coverToCountYear } = require('../utils/index.js');

const {
    SOURCE_TYPE_CONTRAST,
    SOURCE_TYPE_TOTAL,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
    COUNT_DB_TYPE_NUM,
    COUNT_DB_TYPE_WORDS,
} = require('../../../../src/views/Statistic/const.js');

const { msgJsonAll, msgJsonCome, msgJsonGo, ALL_YEAR } = require('../const.js');

const { countWord } = require('./countMsgWords/lib/index.js');

console.time('countYear-words');
calc(msgJsonAll, DIRECTION_TYPE_ALL, COUNT_DB_TYPE_NUM);
calc(msgJsonCome, DIRECTION_TYPE_COME, COUNT_DB_TYPE_NUM);
calc(msgJsonGo, DIRECTION_TYPE_GO, COUNT_DB_TYPE_NUM);

calc(msgJsonAll, DIRECTION_TYPE_ALL, COUNT_DB_TYPE_WORDS);
calc(msgJsonCome, DIRECTION_TYPE_COME, COUNT_DB_TYPE_WORDS);
calc(msgJsonGo, DIRECTION_TYPE_GO, COUNT_DB_TYPE_WORDS);
console.timeEnd('countYear-words');

function calc(calcArr, directionType, countType) {
    const countYear = makeCount(calcArr, countType);
    const outDir = path.join(
        DIR_OUTPUT_PUBLIC_JSON_STATISTIC,
        `./${SOURCE_TYPE_CONTRAST}/${directionType}/${countType}`,
    );
    fs.mkdirpSync(outDir);

    fs.writeFileSync(path.join(outDir, `./year-count.json`), JSON.stringify(countYear, null, 4));
}

function makeCount(arr, countType) {
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
        const len = countType === COUNT_DB_TYPE_NUM ? 1 : countWord(cV);

        find.count += len;
        addDirection(find, cV, len);

        return pre;
    }, []);

    const yearCountData = coverToCountYear(res, ALL_YEAR, SOURCE_TYPE_TOTAL);

    return yearCountData;
}
