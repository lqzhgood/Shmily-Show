/**
 * @name:
 * @description: 通过前端的修改和删除操作会将需要操作记录至  filter.js 和 modify.js
 *              filter.js modify.js 都会包含 msg属性（MSG_ORIGINAL.json中的msg） 用于找到 MSG_ORIGINAL.json 中的 msg 进行修改
 *              这样做是为了保护原始数据，以防误操作删除或修改。
 * @param {*}
 * @return {*}
 */

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const { getJSON, setJSON } = require('../../utils/index');
const { getPublicFileDirByHtml, IS_NEED_DELETE_FLAG, MSG_SLICE } = require('../../../src/common.js');

const {
    FILE_OUTPUT_JSON_MSG,
    FILE_OUTPUT_JSON_MSG_ORIGINAL,
    FILE_INPUT_MSG_MODIFY,
    DIR_OUTPUT_MSG_DATA_STATIC,
} = require('../../config');

const _msgJsonOriginal = getJSON(FILE_OUTPUT_JSON_MSG_ORIGINAL);

// 浅拷贝
const msgJsonOriginal = Array.from(_msgJsonOriginal);

// const modifyJson = _modifyJsonSort.filter(
//     ({ oMsg }) => oMsg.ms >= _.head(msgJsonOriginal).ms && oMsg.ms <= _.last(msgJsonOriginal).ms,
// );

const _modifyJson = getJSON(FILE_INPUT_MSG_MODIFY);
// 排序要按原队列的顺序排序 oMsg.index 其实不太严谨 但是如果准确计算的话性能消耗太大
//  同一时间的消息很少，这种边界条件如果出问题下面 msgJsonOriginalPiece 会报错找不到消息 此时只要按顺序从上到下 modify 就可以避免了
const _modifyJsonSort = _.sortBy(_modifyJson, ['oMsg.ms', 'oMsg.index']);

let modifyJson;

if (MSG_SLICE) {
    // modify
    // server 端保证 msgModify / comment 顺序 使得这里可以进行优化
    //   modify.json |    msg.json
    // l1     1        |       x
    // l2     2        |       x
    // l3     3        |       1
    // l4     4        |       2

    // 在保证顺序的情况下，如 modify l1 的数据匹配上了  msg l3，那么 modify l2 可以直接从 msg l4 开始往后查找 不需要再重新查询 msg 的 l1-l3
    // 这里不优化的情况下 i7-7700HQ也就 100ms 以下

    // 获取在 msg 区间内的修改
    const msgJsonOriginal_headMs = _.head(msgJsonOriginal).ms;
    const msgJsonOriginal_lastMs = _.last(msgJsonOriginal).ms;

    const modifyS = _.findIndex(
        _modifyJsonSort,
        ({ oMsg }) => oMsg.ms >= msgJsonOriginal_headMs && oMsg.ms <= msgJsonOriginal_lastMs,
    );
    const modifyE =
        _.findLastIndex(
            _modifyJsonSort,
            ({ oMsg }) => oMsg.ms >= msgJsonOriginal_headMs && oMsg.ms <= msgJsonOriginal_lastMs,
        ) + 1; // 注意这里 +1  没找到数据应该是 -1 这里 +1 后,未找到数据变成了 0

    if (modifyS == -1 && modifyE == 0) {
        // 范围内未匹配到 modify 数据
        modifyJson = [];
    } else if (modifyS > -1 && modifyE > 0) {
        // 匹配到了数据 并且起始范围正确
        modifyJson = _modifyJsonSort.slice(modifyS, modifyE);
    } else {
        console.warn('❌', '未知情况的 modify 数据筛选, 理论上压根不会出现', `modifyS:${modifyS} modifyE:${modifyE}`);
        throw new Error('');
    }
    console.log('✔️', `匹配到 modifyJson 数据 ${modifyJson.length} 条`);

    setJSON(`_modifyS`, modifyS);
    setJSON(`_modifyE`, modifyE);
    setJSON(`_msgJsonOriginal_headMs`, msgJsonOriginal_headMs);
    setJSON(`_msgJsonOriginal_lastMs`, msgJsonOriginal_lastMs);
    setJSON(`_modifyJsonSort`, _modifyJsonSort);
} else {
    modifyJson = _modifyJsonSort;
}

console.time('x');
let cursor = 0;
for (let i = 0; i < modifyJson.length; i++) {
    const { type, oMsg, nMsg, deleteAssets } = modifyJson[i];

    const msgJsonOriginalPiece = msgJsonOriginal.slice(cursor);

    // 查看是否有且仅有一个评论匹配
    const num = msgJsonOriginalPiece.filter(v => v && v.id === oMsg.id).length;
    if (num != 1) {
        if (num === 0) {
            console.warn('❌', '没找到相应的ID', type, oMsg.id);
        } else if (num >= 2) {
            console.warn('❌', '存在多条相同ID', type, oMsg.id);
        }
        throw new Error();
    }

    // 上面 num 验证过这里肯定能找到且有且为一个
    const cIndex = msgJsonOriginalPiece.findIndex(v => v && v.id === oMsg.id);
    const msgIndex = cursor + cIndex;

    // 只能保证 modify 的时间顺序，但是并不能保证同时间的数据顺序和 msgJson 一致
    // 如果同时间的数据 先修改了 B 后修改了 A , 那么先 find B，拿B的index去slice MsgJson， A 就会被 slice 掉，从而找不到报错
    // 所以如果下一条消息时间相等，那么游标cursor不移动  i 的 msgJsonOriginalPiece 等于 i+1 的 msgJsonOriginalPiece
    if (oMsg.ms !== modifyJson[i + 1]?.oMsg?.ms) {
        cursor = msgIndex;
    }

    if (type === 'modify') {
        msgJsonOriginal[msgIndex] = nMsg;
    } else if (type === 'delete') {
        // 删除 文件
        if (deleteAssets) {
            const srcArr = getPublicFileDirByHtml(oMsg.html);
            srcArr.forEach(du => {
                const p = path.join(DIR_OUTPUT_MSG_DATA_STATIC, du);
                const f_exist = fs.existsSync(p);
                if (f_exist) {
                    // 只重命名 不真删除
                    const { name, ext, dir } = path.parse(p);
                    const np = path.join(dir, name + IS_NEED_DELETE_FLAG + ext);
                    fs.renameSync(p, np);
                    console.log('移动成功', np);
                }
            });
        }
        msgJsonOriginal[msgIndex] = undefined;
    }
}
console.timeEnd('x');

// check
const msgJsonFilter = msgJsonOriginal.filter(v => v);
if (msgJsonOriginal.length - msgJsonFilter.length !== modifyJson.filter(v => v.type == 'delete').length) {
    throw new Error(`有剩余的 modifyJson delete 未处理`);
}

// sort 有可能 modify 中移动了某条消息的位置(修改了时间)
const sort = _.sortBy(msgJsonFilter, 'ms');

// fs.writeFileSync(FILE_OUTPUT_JSON_MSG, JSON.stringify(sort));
setJSON(FILE_OUTPUT_JSON_MSG, sort);
