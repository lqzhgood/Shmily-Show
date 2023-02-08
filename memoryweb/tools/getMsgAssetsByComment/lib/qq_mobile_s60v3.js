const _ = require('lodash');
const { copy } = require('../utils.js');
const { plain } = require('./plain');

const { MobileQQ_s60v3_type_文件 } = require('../../../src/components/Msg/source/MobileQQ/os/s60v3/types.js');

function qq_mobile_s60v3(m) {
    switch (m.type) {
        case MobileQQ_s60v3_type_文件: {
            // 可以有文件不存在
            const url = _.get(m, '$MobileQQ.fileParse.url');
            copy(m, url, { unLog: true });
            break;
        }
        default:
            plain(m);
            break;
    }
}

module.exports = { qq_mobile_s60v3 };
