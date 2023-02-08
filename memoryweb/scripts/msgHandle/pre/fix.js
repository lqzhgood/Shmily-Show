const fs = require('fs');

const { FILE_OUTPUT_JSON_MSG } = require('../../config');
const { getJSON, setJSON } = require('../../utils/index');

const msgJson = getJSON(FILE_OUTPUT_JSON_MSG);

for (let i = 0; i < msgJson.length; i++) {
    const m = msgJson[i];
    fixDevice(m);
    fixNumAndName(m, 'sender', 'senderName');
    fixNumAndName(m, 'receiver', 'receiverName');
}

// fs.writeFileSync(FILE_OUTPUT_JSON_MSG, JSON.stringify(msgJson));
setJSON(FILE_OUTPUT_JSON_MSG, msgJson);

function fixNumAndName(m, num, name) {
    // 首位_代表人工手动赋值 仅测试使用

    if (m[name]) {
        m[name] = m[name]
            .replace(/&nbsp;/g, ' ')
            .replace(/\s/gim, ' ')
            .trim();
    }

    if (['SMS', 'CallLog'].includes(m.source)) {
        m[num] = m[num].replace(/^_/, '');

        if (/^\+86\d{11}$/.test(m[name])) {
            // 去掉手机号首尾 +86
            m[name] = m[name].replace(/^\+86/, '');
        }

        m[name] = m[name].replace(/^_/, '');
        if (/^\+86\d{11}$/.test(m[num])) {
            // 去掉手机号首尾 +86
            m[num] = m[num].replace(/^\+86/, '');
        }
    }
}

function fixDevice(m) {
    switch (m.device) {
        case 'Nokia 5800w Xpre':
            m.device = 'Nokia 5800w';
            break;
        case 'Nokia 6220c-1':
            m.device = 'Nokia 6220c';
            break;
        case 'Nokia 1234':
        case 'Nokia':
        case 'Nokia 6120ci':
            m.device = 'Nokia 6120c';
            break;
        case 'Xiaomi MiTwo':
            m.device = 'Xiaomi Mi2s';
            break;
        default:
            break;
    }
}
