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

const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC } = require('../../config');

const {
    SOURCE_TYPE_TOTAL,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
} = require('../../../src/views/Statistic/const.js');

const { makeDate, addDirection, sortByArr } = require('./utils');

const { msgJsonAll, msgJsonCome, msgJsonGo, ALL_SOURCE } = require('./const.js');

console.time('heatmap');
calc(msgJsonAll, DIRECTION_TYPE_ALL);
calc(msgJsonCome, DIRECTION_TYPE_COME);
calc(msgJsonGo, DIRECTION_TYPE_GO);
console.timeEnd('heatmap');

function calc(calcArr, directionType) {
    // 时间热力图 - 月/年
    const timeHotYear = calcArr
        .reduce((pre, cV) => {
            const t = dayjs(cV.ms);
            const m = t.format('YYYY-MM');

            const findDate = pre.find(v => v.date === m);
            makeTypeTree(findDate, cV);

            return pre;
        }, makeDate(msgJsonAll, 'month', []))
        .map(v => {
            const t = dayjs(v.date, 'YYYY-MM');

            v.year = t.year();
            v.month = t.month() + 1;

            v.type = sortByArr(v.type, ALL_SOURCE, 'source');
            return v;
        });

    const HEATMAP_ALL_YEAR = {
        max: timeHotYear.reduce((pre, cV) => (pre >= cV.count ? pre : cV.count), 0),
        total: timeHotYear.reduce((pre, cV) => pre + cV.count, 0),
        data: timeHotYear,
    };

    const dirAllYear = path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_TOTAL}/${directionType}/heatmap/`);
    fs.mkdirpSync(dirAllYear);
    // 写入单独文件 年不需要分段写入
    fs.writeFileSync(path.join(dirAllYear, 'year.json'), JSON.stringify(HEATMAP_ALL_YEAR, null, 4));

    /**
     * @name:
     * @description:  按类别生成热力图数据
     * @param {*}
     * @return {*}
     */
    ALL_SOURCE.forEach(s => {
        const sData = _.cloneDeep(timeHotYear).map(grid => {
            const find = grid.type.find(t => t.source == s);
            if (find) {
                grid.source = s;
                grid = Object.assign(grid, find);
            } else {
                grid = Object.assign(grid, {
                    source: s,
                    type: [],
                    count: 0,
                });
                delete grid.direction;
            }
            return grid;
        });
        const outDir = path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${s}/${directionType}/heatmap/`);
        fs.mkdirpSync(outDir);

        const HEATMAP_SOURCE_YEAR = {
            max: sData.reduce((pre, cV) => (pre >= cV.count ? pre : cV.count), 0),
            total: sData.reduce((pre, cV) => pre + cV.count, 0),
            data: sData,
        };

        // 写入单独文件 年不需要分段写入
        fs.writeFileSync(path.join(outDir, `year.json`), JSON.stringify(HEATMAP_SOURCE_YEAR, null, 4));
    });

    // 时间热力图 - 星期/月
    const timeHotWeek = calcArr
        .reduce((pre, cV) => {
            const t = dayjs(cV.ms);
            const d = t.format('YYYY-MM-DD');

            const findDate = pre.find(v => v.date === d);
            makeTypeTree(findDate, cV);

            return pre;
        }, makeDate(msgJsonAll, 'day', []))
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

            v.type = sortByArr(v.type, ALL_SOURCE, 'source');

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

    // fs.writeFileSync(
    //     path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_TOTAL}/${directionType}/timeHot-week.json`),
    //     JSON.stringify(HEATMAP_ALL_WEEK, null, 4),
    // );

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
        const dir = path.join(
            DIR_OUTPUT_PUBLIC_JSON_STATISTIC,
            `./${SOURCE_TYPE_TOTAL}/${directionType}/heatmap/week/`,
        );
        fs.mkdirpSync(dir);
        fs.writeFileSync(path.join(dir, `${y}.json`), JSON.stringify(part, null, 4));
    });

    ALL_SOURCE.forEach(s => {
        const sData = _.cloneDeep(timeHotWeek).map(y => {
            y.data = y.data.map(grid => {
                const find = grid.type.find(t => t.source == s);
                if (find) {
                    grid.source = s;
                    grid = Object.assign(grid, find);
                } else {
                    grid = Object.assign(grid, {
                        source: s,
                        type: [],
                        count: 0,
                    });
                    delete grid.direction;
                }
                return grid;
            });
            y.max = y.data.reduce((pre, cV) => (pre > cV.count ? pre : cV.count), 0);
            y.total = y.data.reduce((pre, cV) => pre + cV.count, 0);
            return y;
        });

        const outDir = path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${s}/${directionType}/heatmap/week/`);
        fs.mkdirpSync(outDir);

        const HEATMAP_SOURCE_WEEK = {
            max: sData.reduce((pre, cV) => (pre > cV.max ? pre : cV.max), 0),
            total: sData.reduce((pre, cV) => pre + cV.total, 0),
            data: sData,
        };

        // fs.writeFileSync(path.join(outDir, `week.json`), JSON.stringify(HEATMAP_SOURCE_WEEK, null, 4));
        HEATMAP_SOURCE_WEEK.group = _.groupBy(HEATMAP_SOURCE_WEEK.data, 'year');
        Object.entries(HEATMAP_SOURCE_WEEK.group).forEach(([y, data]) => {
            const currYearData = data[0];
            currYearData.maxDays = currYearData.data
                .filter(v => v.count !== 0 && v.count === currYearData.max)
                .map(v => v.date);
            const part = {
                max: HEATMAP_SOURCE_WEEK.max,
                total: HEATMAP_SOURCE_WEEK.total,
                data: currYearData,
            };
            fs.writeFileSync(path.join(outDir, `${y}.json`), JSON.stringify(part, null, 4));
        });
    });

    // 时间热力图 - 天
    const timeHotDay = calcArr
        .reduce((pre, cV) => {
            const t = dayjs(cV.ms);
            const d = t.format('YYYY-MM-DD HH');

            const findDate = pre.find(v => v.date === d);
            makeTypeTree(findDate, cV);

            return pre;
        }, makeDate(msgJsonAll, 'hour', []))
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
    // fs.writeFileSync(
    //     path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./source/${SOURCE_TYPE_TOTAL}/timeHot-day.json`),
    //     JSON.stringify(HEATMAP_ALL_DAY, null, 4),
    // );

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
        const dir = path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_TOTAL}/${directionType}/heatmap/day/`);
        fs.mkdirpSync(dir);
        fs.writeFileSync(path.join(dir, `${y}.json`), JSON.stringify(part, null, 4));
    });

    ALL_SOURCE.forEach(s => {
        const sData = _.cloneDeep(timeHotDay).map(y => {
            y.data = y.data.map(grid => {
                const find = grid.type.find(t => t.source == s);
                if (find) {
                    grid.source = s;
                    grid = Object.assign(grid, find);
                } else {
                    grid = Object.assign(grid, {
                        source: s,
                        type: [],
                        count: 0,
                    });
                    delete grid.direction;
                }
                return grid;
            });
            y.max = y.data.reduce((pre, cV) => (pre > cV.count ? pre : cV.count), 0);
            y.total = y.data.reduce((pre, cV) => pre + cV.count, 0);
            return y;
        });

        const outDir = path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${s}/${directionType}/heatmap/day/`);
        fs.mkdirpSync(outDir);

        const HEATMAP_SOURCE_DAY = {
            max: sData.reduce((pre, cV) => (pre > cV.max ? pre : cV.max), 0),
            total: sData.reduce((pre, cV) => pre + cV.total, 0),
            data: sData,
        };
        // fs.writeFileSync(path.join(outDir, `timeHot-day.json`), JSON.stringify(HEATMAP_SOURCE_DAY, null, 4));

        HEATMAP_SOURCE_DAY.group = _.groupBy(HEATMAP_SOURCE_DAY.data, 'year');
        Object.entries(HEATMAP_SOURCE_DAY.group).forEach(([y, data]) => {
            const currYearData = data[0];
            currYearData.maxDays = currYearData.data
                .filter(v => v.count !== 0 && v.count === currYearData.max)
                .map(v => v.date);
            const part = {
                max: HEATMAP_SOURCE_DAY.max,
                total: HEATMAP_SOURCE_DAY.total,
                data: currYearData,
            };
            fs.writeFileSync(path.join(outDir, `${y}.json`), JSON.stringify(part, null, 4));
        });
    });

    function makeTypeTree(findDate, cV) {
        findDate.count++;
        addDirection(findDate, cV);

        let findSource = findDate.type.find(v => v.source == cV.source);
        if (!findSource) {
            findSource = {
                source: cV.source,
                count: 0,
                direction: { go: 0, come: 0, goP: 0, comeP: 0 },
                type: [],
            };
            findDate.type.push(findSource);
        }
        findSource.count++;
        addDirection(findSource, cV);

        let findType = findSource.type.find(v => v.type == cV.type);
        if (!findType) {
            findType = {
                type: cV.type,
                count: 0,
                direction: { go: 0, come: 0, goP: 0, comeP: 0 },
            };
            findSource.type.push(findType);
        }
        findType.count++;
        addDirection(findType, cV);
    }
}
