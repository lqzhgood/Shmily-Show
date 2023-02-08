const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');

const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC, FILE_INPUT_MSG_MODIFY } = require('../../config');

const { SOURCE_TYPE_EDIT } = require('../../../src/views/Statistic/const.js');

const { getJSON } = require('../../utils/index');
const modifyJsonDir = path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_EDIT}/`);

const _modifyJson = getJSON(FILE_INPUT_MSG_MODIFY);
const modifyJson = _.sortBy(_modifyJson, 'ms');

if (modifyJson.length === 0) return;

fs.mkdirpSync(modifyJsonDir);
const modifyTypeAndCount = {
    label: '聊天记录编辑',
    count: modifyJson.length,
    children: [],
};

modifyJson.forEach(v => {
    let f = modifyTypeAndCount.children.find(m => alias(m.label) === alias(v.type));
    if (!f) {
        f = {
            label: alias(v.type),
            count: 0,
        };
        modifyTypeAndCount.children.push(f);
    }
    f.count++;
});

fs.writeFileSync(
    path.join(modifyJsonDir, 'modify-mind-typeAndCount.json'),
    JSON.stringify(modifyTypeAndCount, null, 4),
);

const sourceCountData = {
    sourceData: modifyTypeAndCount,
};

fs.writeFileSync(path.join(modifyJsonDir, 'modify-sourceCount.json'), JSON.stringify(sourceCountData, null, 4));

function alias(type) {
    const key_modify = '✏️ 修改';
    const key_delete = '❌ 删除';

    switch (type) {
        case 'modify':
        case key_modify:
            return key_modify;
        case 'delete':
        case key_delete:
            return key_delete;
        default:
            throw new Error('不应该出现这个错误');
    }
}
