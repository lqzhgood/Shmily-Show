const _ = require('lodash');
const { plain } = require('./plain');
const { copy } = require('../utils.js');

const { QQ_type_文件 } = require('../../../src/components/Msg/source/QQ/types.js');

function qq_pc(m) {
    if (m.type === QQ_type_文件) {
        const url = _.get(m, '$QQ.data.fileParse.url');
        // 可能没有文件名
        if (url !== './data/qq-pc/file/') {
            copy(m, url, { unLog: true });
        }
    }

    plain(m);
}

module.exports = { qq_pc };
