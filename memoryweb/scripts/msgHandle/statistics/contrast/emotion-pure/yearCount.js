const fs = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC, DIR_WEB_CODE } = require('../../../../config');
const { addDirection, coverToCountYear } = require('../../utils/index.js');
const { numToPercent } = require(path.join(DIR_WEB_CODE, './common.js'));

const {
    SOURCE_TYPE_TOTAL,
    SOURCE_TYPE_CONTRAST,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
} = require('../../../../../src/views/Statistic/const.js');

const { msgJsonAll, msgJsonCome, msgJsonGo, ALL_YEAR } = require('../../const.js');

const { countEmotion } = require('./lib/index.js');

console.time('countYear-emotion-pure');

// 统计参与纯表情统计的消息数量 只统计总量
const COUNT_MSG_LENGTH = [
    {
        type: DIRECTION_TYPE_ALL,
        count: 0,
        all: { total: 0, percent: '-' },
        part: { total: 0, percent: '-' },
        allPercent: '-',
    },
    {
        type: DIRECTION_TYPE_COME,
        count: 0,
        all: { total: 0, percent: '-' },
        part: { total: 0, percent: '-' },
        allPercent: '-',
    },
    {
        type: DIRECTION_TYPE_GO,
        count: 0,
        all: { total: 0, percent: '-' },
        part: { total: 0, percent: '-' },
        allPercent: '-',
    },
];

calc(msgJsonAll, DIRECTION_TYPE_ALL);
calc(msgJsonCome, DIRECTION_TYPE_COME);
calc(msgJsonGo, DIRECTION_TYPE_GO);

fs.writeFileSync(
    path.join(
        path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_CONTRAST}/${DIRECTION_TYPE_ALL}/emotion-pure/`),
        `./count-msg-length.json`,
    ),
    JSON.stringify(COUNT_MSG_LENGTH, null, 4),
);

console.timeEnd('countYear-emotion-pure');
function calc(calcArr, directionType) {
    const countYear = makeCount(calcArr, directionType);
    const outDir = path.join(
        DIR_OUTPUT_PUBLIC_JSON_STATISTIC,
        `./${SOURCE_TYPE_CONTRAST}/${directionType}/emotion-pure/`,
    );
    fs.mkdirpSync(outDir);

    fs.writeFileSync(path.join(outDir, `./year-count.json`), JSON.stringify(countYear, null, 4));

    const pieData = fs.readJsonSync(
        path.join(
            DIR_OUTPUT_PUBLIC_JSON_STATISTIC,
            `./${SOURCE_TYPE_TOTAL}/${directionType}/`,
            `pie-typeAndCount.json`,
        ),
    );
    const cM = COUNT_MSG_LENGTH.find(v => v.type === directionType);
    cM.all.total = pieData.count;

    cM.all.percent = numToPercent(cM.count / cM.all.total, 1);
    cM.part.percent = numToPercent(cM.count / cM.part.total, 1);
    cM.allPercent = numToPercent(cM.count / COUNT_MSG_LENGTH.find(v => v.type === DIRECTION_TYPE_ALL).all.total, 1);
}

function makeCount(arr, directionType) {
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

        const n = countEmotion(cV);
        const len = n ? n : 0;

        const cM = COUNT_MSG_LENGTH.find(v => v.type === directionType);
        cM.count += len;
        if (n !== null) {
            cM.part.total++;
        }

        find.count += len;
        addDirection(find, cV, len);

        return pre;
    }, []);
    const yearCountData = coverToCountYear(res, ALL_YEAR, SOURCE_TYPE_TOTAL);

    return yearCountData;
}
