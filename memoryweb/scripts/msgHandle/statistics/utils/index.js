const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');

const { KEY_ALL, DIRECTION_TYPE_ALL } = require('../../../../src/views/Statistic/const');

const { DIR_WEB_CODE, DIR_OUTPUT_PUBLIC_JSON_STATISTIC } = require('../../../config.js');
const { numToPercent } = require(path.join(DIR_WEB_CODE, './common.js'));

// 时间需要考虑连续性 无信息的时间需要手动赋0
function makeDate(arr, type, sourceAll) {
    let fmt;
    switch (type) {
        case 'year':
            fmt = 'YYYY';
            break;
        case 'month':
            fmt = 'YYYY-MM';
            break;
        case 'day':
            fmt = 'YYYY-MM-DD';
            break;
        case 'hour':
            fmt = 'YYYY-MM-DD HH';
            break;
    }
    const compareFmt = fmt.replace(/-/g, '').replace(/\s/g, '');

    const ms_s = arr.reduce((pre, cV) => (pre < cV.ms ? pre : cV.ms), Date.now());
    const ms_e = arr.reduce((pre, cV) => (pre > cV.ms ? pre : cV.ms), 0);

    const endFmt = dayjs(ms_e).format(compareFmt);

    const date = [];
    let step = 0;

    // eslint-disable-next-line
    while (true) {
        const curr = dayjs(ms_s).add(step, type);
        const currCmp = curr.format(compareFmt);
        if (currCmp > endFmt) break;
        // eslint-disable-next-line no-loop-func
        [KEY_ALL].concat(sourceAll).forEach(s => {
            date.push({ date: curr.format(fmt), source: s, type: [], count: 0 });
        });
        step++;
    }
    return date;
}

function findItemSource(arr, cV, fn, addValue = 1) {
    let f = arr.find(fn);
    if (!f) console.warn('不应该出现这个错误,这个错误出现说明生成的数组不是连续的,空白位置没有被0填充');

    f.count += addValue;
    addDirection(f, cV, addValue);

    // KEY_ALL
    const fSource = arr.find(v => v.source === KEY_ALL && v.date == f.date);

    fSource.count += addValue;
    addDirection(fSource, cV, addValue);
    return f;
}

function findItemType(arr, cV, addValue = 1) {
    let fType = arr.find(v => v.type == cV.type);

    if (!fType) {
        fType = _.cloneDeep({ type: cV.type, count: 0, direction: { go: 0, come: 0, goP: 0, comeP: 0 } });
        arr.push(fType);
    }

    fType.count += addValue;
    addDirection(fType, cV, addValue);
}

function addDirection(obj, cV, addValue = 1) {
    if (!obj.direction) obj.direction = { go: 0, come: 0, goP: 0, comeP: 0 };
    obj.direction[cV.direction] += addValue;
    const d_p = obj.direction.go + obj.direction.come;
    obj.direction.goP = numToPercent(obj.direction.go / d_p);
    obj.direction.comeP = numToPercent(obj.direction.come / d_p);
}

function sortByArr(sortA, standardA, field) {
    return sortA.sort((a, b) => {
        const ai = standardA.findIndex(s => s === (field ? a[field] : a));
        const bi = standardA.findIndex(s => s === (field ? b[field] : b));
        return ai - bi;
    });
}

function coverToCountYear(arr, allYear, source) {
    if (!source) throw new Error('no source');
    const res = arr.reduce(
        (pre, cV) => {
            const t = dayjs(cV.date);
            const y = t.year();
            const f = pre.find(item => item.year == y);

            f.total += cV.count;

            f.direction.go += cV.direction.go;
            f.direction.come += cV.direction.come;

            if (f.max < cV.count) {
                f.max = cV.count;
                f.maxDay = [cV];
            } else if (f.max == cV.count) {
                f.maxDay.push(cV);
            }

            // 没有 count 说明这天不活跃
            if (cV.count) {
                f.activityDay++;
                if (cV.direction.go) {
                    f.activityDayDirection.go++;
                }
                if (cV.direction.come) {
                    f.activityDayDirection.come++;
                }
            }

            return pre;
        },
        allYear.map(y => {
            const dataDay = fs.readJsonSync(
                path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${source}/${DIRECTION_TYPE_ALL}/data-day.json`),
            );

            const allDay = dataDay.year[y] ? dataDay.year[y].day : 0;

            return {
                year: y,
                total: 0,
                direction: { go: 0, come: 0, goP: '-', comeP: '-' },
                max: 0,
                maxDirection: undefined,
                maxDay: [],
                activityDay: 0,
                activityDayP: 0,
                activityDayDirection: { go: 0, come: 0, goP: '-', comeP: '-' },
                allDay,
                avg: 0,
                avgDirection: { go: 0, come: 0, goP: '-', comeP: '-' },
            };
        }),
    );

    res.forEach(f => {
        f.maxDirection = f.maxDay.reduce(
            (p, cvv) => {
                p.go += cvv.direction.go;
                p.come += cvv.direction.come;
                if (p.go > p.come) p.alias = 'go';
                if (p.go < p.come) p.alias = 'come';
                if (p.go == p.come) p.alias = '-';
                return p;
            },
            { go: 0, come: 0, alias: '-' },
        ).alias;

        if (f.activityDay) {
            f.activityDayP = numToPercent(f.activityDay / f.allDay);
            f.activityDayDirection.goP = numToPercent(f.activityDayDirection.go / f.allDay);
            f.activityDayDirection.comeP = numToPercent(f.activityDayDirection.come / f.allDay);
        }

        if (f.total) {
            f.direction.goP = numToPercent(f.direction.go / f.total);
            f.direction.comeP = numToPercent(f.direction.come / f.total);

            f.avg = NaNToZero((f.total / f.activityDay).toFixed(1));

            f.avgDirection.go = NaNToZero((f.direction.go / f.activityDayDirection.go).toFixed(1));
            f.avgDirection.come = NaNToZero((f.direction.come / f.activityDayDirection.come).toFixed(1));

            f.avgDirection.goP = numToPercent(f.avgDirection.go / f.avg);
            f.avgDirection.comeP = numToPercent(f.avgDirection.come / f.avg);
        }
    });

    return res;
}

function makeSourceData_Avg_ActivityDay(countYearData, direction) {
    const avgData = {
        total: 0,
        avg: 0,
    };
    const activityDayData = {
        allDay: 0,
        activityDay: 0,
        activityDayP: 0,
    };

    if (direction) {
        avgData.avgDirection = { go: 0, come: 0, goP: '-', comeP: '-' };
        activityDayData.activityDayDirection = { go: 0, come: 0, goP: '-', comeP: '-' };
    }

    countYearData.forEach(cV => {
        avgData.total += cV.total;

        activityDayData.allDay += cV.allDay;
        activityDayData.activityDay += cV.activityDay;

        if (direction) {
            activityDayData.activityDayDirection.go += cV.activityDayDirection.go;
            activityDayData.activityDayDirection.come += cV.activityDayDirection.come;
        }
    });

    avgData.avg = NaNToZero((avgData.total / activityDayData.activityDay).toFixed(1));
    activityDayData.activityDayP = numToPercent(activityDayData.activityDay / activityDayData.allDay);

    if (direction) {
        avgData.avgDirection.go = NaNToZero((direction.go / activityDayData.activityDayDirection.go).toFixed(1));
        avgData.avgDirection.come = NaNToZero((direction.come / activityDayData.activityDayDirection.come).toFixed(1));

        avgData.avgDirection.goP = numToPercent(avgData.avgDirection.go / avgData.avg);
        avgData.avgDirection.comeP = numToPercent(avgData.avgDirection.come / avgData.avg);

        activityDayData.activityDayDirection.goP = numToPercent(
            activityDayData.activityDayDirection.go / activityDayData.allDay,
        );
        activityDayData.activityDayDirection.comeP = numToPercent(
            activityDayData.activityDayDirection.come / activityDayData.allDay,
        );
    }

    return { avgData, activityDayData };
}

function NaNToZero(n) {
    return n === 'NaN' || _.isNaN(n) ? 0 : n;
}

module.exports = {
    makeDate,
    findItemSource,
    findItemType,
    addDirection,
    sortByArr,
    coverToCountYear,
    makeSourceData_Avg_ActivityDay,
};
