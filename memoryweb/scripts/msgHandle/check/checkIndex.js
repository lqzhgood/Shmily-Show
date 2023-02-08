const { FILE_OUTPUT_JSON_MSG } = require('../../config');
const { getJSON } = require('../../utils/index');

const { MSG_SLICE } = require('../../../src/common');

const S = MSG_SLICE ? MSG_SLICE.S : 0;

const msgJson = getJSON(FILE_OUTPUT_JSON_MSG);

// 此处预设第一个是正确的 因为要考虑 modify 删除的数量 太复杂了
// 详情参考 giveIndex deleteHeadModify

let deleteHeadModify = 0;

msgJson.forEach((v, i) => {
    if (i === 0) {
        deleteHeadModify = S - v.index;
        return;
    }
    const index = i + S - deleteHeadModify;
    if (v.index != index) {
        console.warn('❌', v.id, index, v.index);
        throw new Error('序号不对');
    }
});
