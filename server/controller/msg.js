const fs = require('fs-extra');
const _ = require('lodash');

const { FILE_INPUT_MSG_ORIGINAL, FILE_INPUT_MSG_MODIFY } = require('../config');
const makePreMsg = require('../lib/makePreMsg');
const { getJSON } = require('../utils/index');

exports.modify = (req, res, next) => {
    const msgJsonOriginal = getJSON(FILE_INPUT_MSG_ORIGINAL);
    const modifyMsg = getJSON(FILE_INPUT_MSG_MODIFY);

    const { modifyMsgArr } = req.body;
    const modifyMsgArrSort = _.sortBy(modifyMsgArr, ['oMsg.ms', 'oMsg.index']);

    for (let i = 0; i < modifyMsgArrSort.length; i++) {
        const { type, nMsg, deleteAssets } = modifyMsgArrSort[i];
        // 通过前端传回的 id 从原始 MSG 中找 oMsg
        const oMsg = msgJsonOriginal.find(v => v.id == nMsg.id);
        if (!oMsg) throw new Error('id 错误,无法找到原始消息');
        const fi = modifyMsg.findIndex(v => v.oMsg.id === oMsg.id);

        modifyMsgArrSort[i].oMsg = oMsg;
        // 记录的 modify msg, 这里 assign 是为了排序需要
        const fixMsg = Object.assign({ type, oMsg, ms: Date.now() }, modifyMsgArrSort[i]);
        if (type === 'delete') {
            if (_.isEqual(_.omit(oMsg, ['index']), _.omit(nMsg, ['index']))) {
                // index 是变动的 所以忽略
                // 可能 PC-QQ Mobile-QQ 发了一样的信息，
                // 但是PC-QQ原始内容为空，自行补充了信息再删除的情况  保留修改后的内容
                delete fixMsg.nMsg;
            }
        }

        if (fi === -1) {
            modifyMsg.push(fixMsg);
        } else {
            // 如果有记录,查看当前记录的 原始msg 是否和本地拿的源文件当前id查询到的原始 msg 一致
            if (!_.isEqual(modifyMsg[fi].oMsg, oMsg)) {
                throw new Error('此条记录之前已修改至 Modify.json， 但现在修改的内容与之前修改的内容不一致 请手动确认');
            }
            modifyMsg[fi] = fixMsg;
        }
    }

    // object key 排序显示
    // type 排最前面 方便看

    // 这里需要保证原始顺序 使得 web 处理 msg.json 时能优化
    const sort_modifyMsg = _.sortBy(modifyMsg, ['oMsg.ms', 'oMsg.index']);

    fs.writeFileSync(FILE_INPUT_MSG_MODIFY, JSON.stringify(sort_modifyMsg, null, 4));

    const reMsg = makePreMsg();

    res.send({
        code: 200,
        msg: 'ok',
        result: reMsg,
    });
};
