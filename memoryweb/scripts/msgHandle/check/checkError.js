const { FILE_OUTPUT_JSON_MSG } = require('../../config');
const { getJSON } = require('../../utils/index');

const msgJson = getJSON(FILE_OUTPUT_JSON_MSG);

const warnType = [];

for (let i = 0; i < msgJson.length; i++) {
    const msg = msgJson[i];
    if (!msg.ms || !msg.type) throw new Error('❌', '没有 ms 或 type 属性', msg);
    if (msg.warn) {
        // console.error('❌', '有 warn 属性', msg);
        warnType.push(msg.warn);
    }

    if (msg.type === 'busy') throw new Error('msg', msg);
    if (!msg.type) console.error('❌', 'not have type', msg);
}

if (warnType.length > 0) console.log('❌', 'Warn', Array.from(new Set(warnType)));
