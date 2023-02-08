const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const dayjs = require('dayjs');

const weekday = require('dayjs/plugin/weekday');
dayjs.extend(weekday);
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(advancedFormat);
const weekYear = require('dayjs/plugin/weekYear');
dayjs.extend(weekYear);
const weekOfYear = require('dayjs/plugin/weekOfYear');
dayjs.extend(weekOfYear);
const dayOfYear = require('dayjs/plugin/dayOfYear');
dayjs.extend(dayOfYear);

const { COUNT_DB_TYPE_NUM, COUNT_DB_TYPE_WORDS } = require('../../../src/views/Statistic/const.js');
const { makeDate, sortByArr } = require('../../msgHandle/statistics/utils/index.js');

const { htmlToText } = require('../utils.js');
const { commentsAll, outDir } = require('./const.js');
const { ALL_SOURCE } = require('../../msgHandle/statistics/const.js');

// eslint-disable-next-line
if (commentsAll.length === 0) return;

console.time('comment-heatmap');
calc(commentsAll, COUNT_DB_TYPE_NUM);
calc(commentsAll, COUNT_DB_TYPE_WORDS);
console.timeEnd('comment-heatmap');

function calc(calcArr, countType) {
    const heatmapDir = path.join(outDir, `./heatmap-${countType}/`);
    fs.mkdirpSync(heatmapDir);

    // 时间热力图 - 月/年
    const timeHotYear = calcArr
        .reduce((pre, cV) => {
            const t = dayjs(cV.ms);
            const m = t.format('YYYY-MM');

            const findDate = pre.find(v => v.date === m);
            makeTypeTree(findDate, cV, countType);

            return pre;
        }, makeDate(commentsAll, 'month', []))
        .map(v => {
            const t = dayjs(v.date, 'YYYY-MM');

            v.year = t.year();
            v.month = t.month() + 1;

            return v;
        });

    const HEATMAP_ALL_YEAR = {
        max: timeHotYear.reduce((pre, cV) => (pre >= cV.count ? pre : cV.count), 0),
        total: timeHotYear.reduce((pre, cV) => pre + cV.count, 0),
        data: timeHotYear,
    };

    // 写入单独文件 年不需要分段写入
    fs.writeFileSync(path.join(heatmapDir, 'year.json'), JSON.stringify(HEATMAP_ALL_YEAR, null, 4));

    // 时间热力图 - 星期/月
    const timeHotWeek = calcArr
        .reduce((pre, cV) => {
            const t = dayjs(cV.ms);
            const d = t.format('YYYY-MM-DD');

            const findDate = pre.find(v => v.date === d);
            makeTypeTree(findDate, cV, countType);

            return pre;
        }, makeDate(commentsAll, 'day', []))
        .map(v => {
            const t = dayjs(v.date, 'YYYY-MM-DD');
            v.year = t.year();
            v.weekYear = t.weekYear();
            v.month = t.month() + 1;
            v.weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][t.weekday()];

            v.week = t.week();
            // 周日算到上周 而非这周第一天
            if (v.weekday == '周日' && t.dayOfYear() == 1) {
                v.week = 0;
            } else if (v.weekday == '周日') {
                v.week = t.subtract(1, 'day').week();
            } else if (v.year != v.weekYear && v.month == 12) {
                // 虚拟的53周
                v.week = 53;
            }

            v.week = v.week.toString();

            // 划线
            const daysInMonth = t.daysInMonth();
            const day = t.date();
            const diffDay = daysInMonth - day;
            if (diffDay < 7) {
                v.lastWeek = true;
                if (diffDay == 0 && v.weekday != '周日') {
                    // 如果是星期日 那么最底部不需要划线
                    v.lastDay = true;
                }
            }

            return v;
        })
        .reduce((pre, cV) => {
            const year = cV.year;
            let findY = pre.find(v => v.year == year);

            if (!findY) {
                findY = {
                    year,
                    max: -1,
                    total: 0,
                    data: [],
                };
                pre.push(findY);
            }
            findY.total += cV.count;
            findY.data.push(cV);
            if (findY.max < cV.count) findY.max = cV.count;
            return pre;
        }, []);

    const HEATMAP_ALL_WEEK = {
        max: timeHotWeek.reduce((pre, cV) => (pre > cV.max ? pre : cV.max), 0),
        total: timeHotWeek.reduce((pre, cV) => pre + cV.total, 0),
        data: timeHotWeek,
    };

    // 分段写入文件
    HEATMAP_ALL_WEEK.group = _.groupBy(HEATMAP_ALL_WEEK.data, 'year');
    Object.entries(HEATMAP_ALL_WEEK.group).forEach(([y, data]) => {
        const currYearData = data[0];
        currYearData.maxDays = currYearData.data
            .filter(v => v.count !== 0 && v.count === currYearData.max)
            .map(v => v.date);
        const part = {
            max: HEATMAP_ALL_WEEK.max,
            total: HEATMAP_ALL_WEEK.total,
            data: currYearData,
        };
        const dir = path.join(heatmapDir, `./week/`);
        fs.mkdirpSync(dir);
        fs.writeFileSync(path.join(dir, `${y}.json`), JSON.stringify(part, null, 4));
    });

    // 时间热力图 - 天
    const timeHotDay = calcArr
        .reduce((pre, cV) => {
            const t = dayjs(cV.ms);
            const d = t.format('YYYY-MM-DD HH');

            const findDate = pre.find(v => v.date === d);
            makeTypeTree(findDate, cV, countType);

            return pre;
        }, makeDate(commentsAll, 'hour', []))
        .map(v => {
            const t = dayjs(v.date, 'YYYY-MM-DD HH');

            v.year = t.year();
            v.day = t.dayOfYear();
            v.hour = t.hour();

            const daysInMonth = t.daysInMonth();
            if (t.date() == daysInMonth) {
                v.lastWeek = true;
            }

            v.type = sortByArr(v.type, ALL_SOURCE, 'source');

            return v;
        })
        .reduce((pre, cV) => {
            const { year } = cV;

            let findY = pre.find(v => v.year == year);

            if (!findY) {
                findY = {
                    year,
                    max: -1,
                    total: 0,
                    data: [],
                };
                pre.push(findY);
            }

            findY.total += cV.count;
            findY.data.push(cV);
            if (findY.max < cV.count) findY.max = cV.count;
            return pre;
        }, []);

    const HEATMAP_ALL_DAY = {
        max: timeHotDay.reduce((pre, cV) => (pre > cV.max ? pre : cV.max), 0),
        total: timeHotDay.reduce((pre, cV) => pre + cV.total, 0),
        data: timeHotDay,
    };

    HEATMAP_ALL_DAY.group = _.groupBy(HEATMAP_ALL_DAY.data, 'year');
    Object.entries(HEATMAP_ALL_DAY.group).forEach(([y, data]) => {
        const currYearData = data[0];
        currYearData.maxDays = currYearData.data
            .filter(v => v.count !== 0 && v.count === currYearData.max)
            .map(v => v.date);
        const part = {
            max: HEATMAP_ALL_DAY.max,
            total: HEATMAP_ALL_DAY.total,
            data: currYearData,
        };
        const dir = path.join(heatmapDir, `/day/`);
        fs.mkdirpSync(dir);
        fs.writeFileSync(path.join(dir, `${y}.json`), JSON.stringify(part, null, 4));
    });
}

function makeTypeTree(findDate, cV, countType) {
    let len;
    if (countType === COUNT_DB_TYPE_NUM) {
        len = 1;
    } else if (countType === COUNT_DB_TYPE_WORDS) {
        len = htmlToText(cV.html).length;
        if (!cV.html) {
            console.log('111', 111);
        }
    }
    findDate.count += len;
}
