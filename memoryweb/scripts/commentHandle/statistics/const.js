const _ = require('lodash');
const dayjs = require('dayjs');
const path = require('path');

const { FILE_INPUT_COMMENTS, DIR_OUTPUT_PUBLIC_JSON_STATISTIC } = require('../../config');
const { getJSON } = require('../../utils/index');
const { SOURCE_TYPE_EDIT } = require('../../../src/views/Statistic/const.js');

const _commentsAll = getJSON(FILE_INPUT_COMMENTS);
const commentsAll = _.sortBy(_commentsAll, 'ms');

const ALL_YEAR = commentsAll.reduce((pre, cV) => {
    const y = dayjs(cV.ms).year();
    if (!pre.includes(y)) pre.push(y);
    return pre;
}, []);

const store = {
    commentsAll,
    ALL_YEAR,
    outDir: path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_EDIT}/`),
};

// 导出深拷贝对象, 避免 statistics 中影响到其他计算
module.exports = new Proxy(store, {
    get(target, key) {
        return _.cloneDeep(target[key]);
    },
});
