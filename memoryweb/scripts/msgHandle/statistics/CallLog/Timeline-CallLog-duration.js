const fs = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');
const _ = require('lodash');

const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC, DIR_WEB_CODE } = require('../../../config');
const { makeDate, findItemSource } = require('../utils');

const { numToPercent } = require(path.join(DIR_WEB_CODE, './common.js'));

const {
    KEY_ALL,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
} = require('../../../../src/views/Statistic/const.js');
const { msgJsonAll } = require('../const.js');

const durationJson = msgJsonAll.filter(m => {
    if (m.source !== 'CallLog') return false;
    const d = _.get(m, '$CallLog.duration');
    return d;
});

const timeData = {
    year: makeDate(msgJsonAll, 'year', ['主叫', '被叫']),
    month: makeDate(msgJsonAll, 'month', ['主叫', '被叫']),
    day: makeDate(msgJsonAll, 'day', ['主叫', '被叫']),
};

// 本身就是对比,所以只需要 DIRECTION_TYPE_ALL 的数据
console.time('timeLine-CallLog-duration');
calc(durationJson, DIRECTION_TYPE_ALL);
console.timeEnd('timeLine-CallLog-duration');

function calc(calcArr, directionType) {
    const res = calcArr.reduce((pre, cV) => {
        const { year, month, day } = pre;

        const t = dayjs(cV.ms);
        const y = t.format('YYYY');
        const m = t.format('YYYY-MM');
        const d = t.format('YYYY-MM-DD');

        let source = callType(cV.type); // 主叫 被叫

        const len = _.get(cV, '$CallLog.duration');

        findItemSource(year, cV, v => v.date == y && v.source === source, len);
        findItemSource(month, cV, v => v.date == m && v.source === source, len);
        findItemSource(day, cV, v => v.date == d && v.source === source, len);

        return pre;
    }, _.cloneDeep(timeData));

    const dirTimeLineSource = path.join(
        DIR_OUTPUT_PUBLIC_JSON_STATISTIC,
        `./CallLog/${directionType}/timeLine-duration/`,
    );
    fs.mkdirpSync(dirTimeLineSource);
    fs.writeFileSync(path.join(dirTimeLineSource, 'year.json'), JSON.stringify(res.year, null, 4));
    fs.writeFileSync(path.join(dirTimeLineSource, 'month.json'), JSON.stringify(res.month, null, 4));
    fs.writeFileSync(path.join(dirTimeLineSource, 'day.json'), JSON.stringify(res.day, null, 4));

    const total = {
        total: res.year.filter(v => v.source === KEY_ALL).reduce((pre, cV) => pre + cV.count, 0),
        max: res.day.filter(v => v.source === KEY_ALL).reduce((pre, cV) => Math.max(pre, cV.count), 0),
    };
    total.maxDays = res.day.filter(v => v.source === KEY_ALL && v.count === total.max).map(v => v.date);

    total.type = res.year.reduce((pre, cV) => {
        if (cV.source === KEY_ALL) return pre;

        let f = pre.find(v => cV.source === v.source);

        if (!f) {
            f = {
                source: cV.source,
                count: 0,
                percent: 0,
                max: 0,
                maxDays: [],
                maxRecord: calcArr
                    .filter(m => callType(m.type) === cV.source)
                    .reduce((p, m) => Math.max(p, _.get(m, '$CallLog.duration')), 0),
                maxRecordDays: [],
            };
            pre.push(f);
        }

        f.count += cV.count;
        f.percent = numToPercent(f.count / total.total);

        return pre;
    }, []);

    res.day.forEach(v => {
        if (v.source === KEY_ALL) return;

        const f = total.type.find(t => t.source === v.source);

        if (v.count > f.max) {
            f.max = v.count;
            f.maxDays = [v.date];
        } else if (v.count === f.max) {
            f.maxDays.push(v.date);
        }
    });

    calcArr.forEach(m => {
        const f = total.type.find(t => t.source === callType(m.type));

        const d = _.get(m, '$CallLog.duration');
        if (d === f.maxRecord) {
            f.maxRecordDays.push(m.day + ' ' + m.time);
        }
    });

    fs.writeFileSync(path.join(dirTimeLineSource, 'total.json'), JSON.stringify(total, null, 4));
}

function callType(t) {
    switch (t) {
        case '呼出未接':
        case '呼出已接':
            return '主叫';
        case '呼入挂断':
        case '呼入未接':
        case '呼入已接':
            return '被叫';
        default:
            console.log('t', t);
            throw new Error('call type error');
    }
}
