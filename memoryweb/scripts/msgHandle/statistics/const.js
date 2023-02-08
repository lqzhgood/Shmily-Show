const _ = require('lodash');
const dayjs = require('dayjs');

const { FILE_OUTPUT_JSON_MSG } = require('../../config');
const { getJSON } = require('../../utils/index');

const { STATISTICS_EXCLUDE_SENDER_AND_RECEIVER } = require('../../user/userGroup.js');
const { KEY_ALL } = require('../../../src/views/Statistic/const.js');

const { countActivityDay } = require('./utils/index.js');

const _msgJsonAll = getJSON(FILE_OUTPUT_JSON_MSG);
// 排除不需要统计的
const msgJsonAll = _msgJsonAll.filter(v => {
    return !STATISTICS_EXCLUDE_SENDER_AND_RECEIVER.some(n => [v.sender, v.receiver].includes(n));
});

const msgJsonCome = msgJsonAll.filter(v => v.direction === 'come');
const msgJsonGo = msgJsonAll.filter(v => v.direction === 'go');

const ALL_SOURCE = _(msgJsonAll.map(v => v.source))
    .uniq()
    .sortBy()
    .value();

// 排序
// 如果有, 置于尾部,例如 come 可能没有 Camera, 这样排序后, Camera 就在最后 不影响前面元素的对比
Array.from(['Camera']).forEach(s => {
    if (!ALL_SOURCE.includes(s)) return;
    _.pull(ALL_SOURCE, s);
    ALL_SOURCE.push(s);
});

const ALL_YEAR = msgJsonAll.reduce((pre, cV) => {
    const y = dayjs(cV.ms).year();
    if (!pre.includes(y)) pre.push(y);
    return pre;
}, []);

const store = {
    msgJsonAll,
    msgJsonCome,
    msgJsonGo,
    ALL_SOURCE,
    ALL_YEAR,
};

// 导出深拷贝对象, 避免 statistics 中影响到其他计算
module.exports = new Proxy(store, {
    get(target, key) {
        return _.cloneDeep(target[key]);
    },
});
