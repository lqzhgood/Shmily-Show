const fs = require('fs');

const { FILE_OUTPUT_JSON_MSG } = require('../../config');
const { getJSON, setJSON } = require('../../utils/index');
const { MSG_SLICE } = require('../../../src/common');

const msgJson = getJSON(FILE_OUTPUT_JSON_MSG);

let S = 0;

if (MSG_SLICE) {
    // 因为 MSG_SLICE 切割的原因，前面的 modify 可能没有参与 msg.json 的修改
    // 那么前面 modify delete 的数量就需要从 index 里面去除
    const modifyJsonSort = getJSON('_modifyJsonSort');
    const modifyS = getJSON('_modifyS');
    const modifyE = getJSON('_modifyE');
    const msgJsonOriginal_headMs = getJSON('_msgJsonOriginal_headMs');
    const msgJsonOriginal_lastMs = getJSON('_msgJsonOriginal_lastMs');

    const headModify = modifyJsonSort.slice(0, modifyS);
    const lastModify = modifyJsonSort.slice(modifyE);

    const h_in_msg_slice = headModify.filter(
        ({ type, oMsg, nMsg }) =>
            type === 'modify' && oMsg.ms < msgJsonOriginal_headMs && nMsg.ms >= msgJsonOriginal_headMs,
    );
    if (h_in_msg_slice.length != 0) {
        console.warn('❌', 'MSG_SLICE S 太大, 未包含 nMsg.ms', h_in_msg_slice);
        throw new Error('详见 /scripts/msgHandle/pre/giveIndex.js');
    }

    const l_in_msg_slice = lastModify.filter(
        ({ type, oMsg, nMsg }) =>
            type === 'modify' && oMsg.ms >= msgJsonOriginal_lastMs && nMsg.ms <= msgJsonOriginal_lastMs,
    );
    if (l_in_msg_slice.length != 0) {
        console.warn('❌', 'MSG_SLICE E 太小, 已包含 nMsg.ms', l_in_msg_slice);
        throw new Error('详见 /scripts/msgHandle/pre/giveIndex.js');
    }

    const deleteHeadModify = headModify.filter(v => v.type === 'delete').length;

    // ######################################################################
    // !!! MSG_SLICE 生效时 modify 会造成 Index 的影响

    // C delete
    // 这种好处理 --> deleteHeadModify

    // ----------------------------------------------------------------------

    // E --> I
    // A --> O

    // R --> F
    // S --> K

    //  这种情况太复杂了,
    //  - 出现的概率极少，只有 msg.json 数据量极大时才需要使用 MSG_SLICE 来减轻 modify 的压力
    //  - 大概率是附近范围的挪动，不至于出现  A --> O 如此极端的情况

    //  如果判断写进去势必影响到速度得不偿失
    //  采取的措施是出现下列情况时,提出警告修改 MSG_SLICE 范围使移动位置的情况
    //  - [全部纳入] MSG_SLICE 范围内
    //  - [全部不纳入] MSG_SLICE 范围内

    //  如果有 A -> O 的极端情况， 应直接修改源 json 文件，或不使用 MSG_SLICE

    //     M前             M后
    // 1   A               B
    // 2   B               D
    // 3   C               R`
    // 4   D               F
    // 5   E               G
    // 6   F               H
    // -----------------------------------
    // 7   G               E`             |
    // 8   H               I              |
    // 9   I               J              |
    // 10  J               S`         MSG_SLICE 区域
    // 11  K               K              |
    // 12  L               L              |
    // 13  M               M              |
    // -----------------------------------
    // 14  N               N
    // 15  O               A`
    // 16  P               O
    // 17  Q               P
    // 18  R               Q
    // 19  S               T
    // 20  T
    // ######################################################################

    S = (MSG_SLICE ? MSG_SLICE.S : 0) - deleteHeadModify;
}

giveIndex(msgJson);

// fs.writeFileSync(FILE_OUTPUT_JSON_MSG, JSON.stringify(msgJson));
setJSON(FILE_OUTPUT_JSON_MSG, msgJson);

function giveIndex(arr) {
    arr.forEach((v, i) => {
        // 给序号
        v.index = i + S;
    });
}
