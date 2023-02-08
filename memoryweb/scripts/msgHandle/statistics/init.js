const fs = require('fs-extra');
const path = require('path');

const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC } = require('../../config');

// 初始化一些东西 如创建目录等
const { ALL_SOURCE } = require('./const.js');

const {
    SOURCE_TYPE_TOTAL,
    SOURCE_TYPE_EDIT,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
} = require('../../../src/views/Statistic/const.js');

ALL_SOURCE.concat([SOURCE_TYPE_TOTAL, SOURCE_TYPE_EDIT]).forEach(s => {
    [DIRECTION_TYPE_ALL, DIRECTION_TYPE_COME, DIRECTION_TYPE_GO].forEach(t => {
        // 这里没有对比数据 所以不需要 DIRECTION 子目录
        if (s === SOURCE_TYPE_EDIT) return;

        const p = path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${s}/${t}/`);
        fs.mkdirpSync(p);
    });
});
