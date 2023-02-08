const fs = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');

const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC, DIR_WEB_CODE } = require('../../config');
const {
    KEY_ALL,
    SOURCE_TYPE_TOTAL,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
} = require('../../../src/views/Statistic/const.js');
const { addDirection, findItemSource, findItemType, makeDate, sortByArr } = require('./utils/index.js');

const { numToPercent } = require(path.join(DIR_WEB_CODE, './common.js'));

const { msgJsonAll, msgJsonCome, msgJsonGo, ALL_SOURCE } = require('./const.js');

console.time('total');
calc(msgJsonAll, DIRECTION_TYPE_ALL);
calc(msgJsonCome, DIRECTION_TYPE_COME);
calc(msgJsonGo, DIRECTION_TYPE_GO);
console.timeEnd('total');

function calc(calcArr, directionType) {
    const outDir = path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_TOTAL}/${directionType}/`);
    fs.mkdirpSync(outDir);

    // 饼图
    let typeAndCountData = calcArr.reduce((pre, cV) => {
        let findSource = pre.find(v => v.label === cV.source);
        if (!findSource) {
            findSource = {
                label: cV.source,
                count: 0,
                icon: `/static/icon/source/${cV.source}.png`,
                direction: null,
                children: [],
            };
            pre.push(findSource);
        }
        addDirection(findSource, cV);

        findSource.count++;
        findSource.index = pre.findIndex(v => v.label === cV.source);
        findSource.level = findSource.index + 1;

        let findType = findSource.children.find(v => v.label == cV.type);
        if (!findType) {
            findType = {
                label: cV.type,
                count: 0,
                icon: `/static/icon/type/${findSource.label}-${cV.type}.png`,
                direction: null,
                children: [],
            };
            findSource.children.push(findType);
        }
        findType.count++;
        addDirection(findType, cV);

        findType.percent = findType.count / findSource.count;
        findType.index = findSource.children.findIndex(v => v.label == cV.type);
        findType.level = `${findSource.level}-${findType.index + 1}`;

        return pre;
    }, []);

    // !!! 下面都是用的这里的数据 所以下面不用做排序了
    typeAndCountData = sortByArr(typeAndCountData, ALL_SOURCE, 'label');

    const sourceAll = typeAndCountData.map(v => v.label);
    const typeAndCountTotal = typeAndCountData.reduce((pre, cV) => pre + cV.count, 0);

    typeAndCountData.forEach(v => {
        v.percent = v.count / typeAndCountTotal;
    });

    const pieData = {
        label: KEY_ALL,
        count: typeAndCountTotal,
        direction: typeAndCountData.reduce(
            (pre, cV) => {
                pre.go += cV.direction.go;
                pre.come += cV.direction.come;
                const d_p = pre.go + pre.come;
                pre.goP = numToPercent(pre.go / d_p);
                pre.comeP = numToPercent(pre.come / d_p);

                return pre;
            },
            { go: 0, come: 0, goP: '0', comeP: '0' },
        ),
        children: typeAndCountData,
    };

    fs.writeFileSync(path.join(outDir, `pie-typeAndCount.json`), JSON.stringify(pieData, null, 4));

    // 思维导图
    const mindData = Object.assign(pieData, { level: '0-0', id: '0-0', index: 0, percent: 1 });
    function giveId(obj) {
        obj.children.forEach(v => {
            v.id = 'id_' + v.level;
            if (v.children) {
                giveId(v);
            }
        });
    }
    giveId(mindData);

    fs.writeFileSync(path.join(outDir, `mind-typeAndCount.json`), JSON.stringify(mindData, null, 4));

    // 时间折线
    const timeLine = timeLineHandle(msgJsonAll, calcArr, sourceAll, 'source');
    const dirTimeLineAll = path.join(outDir, `/timeLine/`);
    fs.mkdirpSync(dirTimeLineAll);

    fs.writeFileSync(path.join(dirTimeLineAll, 'year.json'), JSON.stringify(timeLine.year, null, 4));
    fs.writeFileSync(path.join(dirTimeLineAll, 'month.json'), JSON.stringify(timeLine.month, null, 4));
    fs.writeFileSync(path.join(dirTimeLineAll, 'day.json'), JSON.stringify(timeLine.day, null, 4));

    // 各个 source 的时间线数据
    typeAndCountData.forEach(s => {
        const res = timeLineHandle(
            msgJsonAll,
            calcArr.filter(v => v.source == s.label),
            s.children.map(v => v.label),
            'type',
        );

        // 只需要一级
        Object.values(res).forEach(arr => {
            arr.forEach(v => {
                delete v.type;
            });
        });

        const dirTimeLineSource = path.join(
            DIR_OUTPUT_PUBLIC_JSON_STATISTIC,
            `./${s.label}/${directionType}/timeLine/`,
        );
        fs.mkdirpSync(dirTimeLineSource);
        fs.writeFileSync(path.join(dirTimeLineSource, 'year.json'), JSON.stringify(res.year, null, 4));
        fs.writeFileSync(path.join(dirTimeLineSource, 'month.json'), JSON.stringify(res.month, null, 4));
        fs.writeFileSync(path.join(dirTimeLineSource, 'day.json'), JSON.stringify(res.day, null, 4));
    });
}

/**
 * @name:
 * @description:
 * @param {*} msgAll 要生成时间范围的数组
 * @param {*} arr 要统计的数组
 * @param {*} timeArr
 * @param {*} findTrait
 * @return {*}
 */
function timeLineHandle(msgAll, arr, timeArr, findTrait) {
    return arr.reduce(
        (pre, cV) => {
            const { year, month, day } = pre;

            const t = dayjs(cV.ms);
            const y = t.format('YYYY');
            const m = t.format('YYYY-MM');
            const d = t.format('YYYY-MM-DD');

            const findY = findItemSource(year, cV, v => v.date == y && v.source == cV[findTrait]);
            const findTypeY = findItemType(findY.type, cV);

            const findM = findItemSource(month, cV, v => v.date == m && v.source == cV[findTrait]);
            const findTypeM = findItemType(findM.type, cV);

            const findD = findItemSource(day, cV, v => v.date == d && v.source == cV[findTrait]);
            const findTypeD = findItemType(findD.type, cV);

            return pre;
        },
        {
            year: makeDate(msgAll, 'year', timeArr),
            month: makeDate(msgAll, 'month', timeArr),
            day: makeDate(msgAll, 'day', timeArr),
        },
    );
}
