// !!! 因为是读取的 countYear 和 Total 的数据 所以必须放到最后

const fs = require('fs-extra');
const path = require('path');

const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC } = require('../../config');
const { ALL_SOURCE } = require('./const.js');

const {
    SOURCE_TYPE_TOTAL,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
} = require('../../../src/views/Statistic/const.js');

const { makeSourceData_Avg_ActivityDay } = require('./utils/index.js');

console.time('sourceCount');
calc(DIRECTION_TYPE_ALL);
calc(DIRECTION_TYPE_COME);
calc(DIRECTION_TYPE_GO);
console.timeEnd('sourceCount');

function calc(directionType) {
    ALL_SOURCE.forEach(s => {
        const countYearData = fs.readJsonSync(
            path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${s}/${directionType}/year-count.json`),
        );
        const maxData = countYearData.reduce((pre, cV) => (cV.max >= pre.max ? cV : pre));

        const typeAndCountData = fs.readJsonSync(
            path.join(
                DIR_OUTPUT_PUBLIC_JSON_STATISTIC,
                `./${SOURCE_TYPE_TOTAL}/${directionType}/mind-typeAndCount.json`,
            ),
        );

        const sourceData = typeAndCountData.children.filter(v => v.label == s)[0];
        // come go 可能没有 ALL_SOURCE
        if (!sourceData) return;

        const { avgData, activityDayData } = makeSourceData_Avg_ActivityDay(countYearData, sourceData.direction);
        fs.writeFileSync(
            path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${s}/${directionType}/sourceCount.json`),
            JSON.stringify({ sourceData, maxData, avgData, activityDayData }, null, 4),
        );
    });
}
