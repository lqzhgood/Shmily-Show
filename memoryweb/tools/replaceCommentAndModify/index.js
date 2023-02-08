const fs = require('fs');
const path = require('path');

const modify = require('./modify');
const modify_more = require('./modify-385219308');

const out_comments = path.join(__dirname, '../../src/assets/data/comments.json');
const out_modify = path.join(__dirname, '../../src/assets/data/modify.json');
const out_modify_more = path.join(__dirname, '../../src/assets/data/modify-385219308.json');

modifyHandle(modify);
modifyHandle(modify_more);

fs.writeFileSync(out_modify, JSON.stringify(modify, null, 4));
fs.writeFileSync(out_modify_more, JSON.stringify(modify_more, null, 4));

function modifyHandle(arr) {
    for (let i = 0; i < arr.length; i++) {
        const m = arr[i];
        const { oMsg, nMsg } = m;
        if (oMsg.source === '手机QQ') {
            oMsg.source = 'MobileQQ';
        }
        if (nMsg && nMsg.source === '手机QQ') {
            nMsg.source = 'MobileQQ';
        }

        if (oMsg.$pcQQ) {
            oMsg.$QQ = oMsg.$pcQQ;
            delete oMsg.$pcQQ;
        }
        if (nMsg && nMsg.$pcQQ) {
            nMsg.$QQ = nMsg.$pcQQ;
            delete nMsg.$pcQQ;
        }
    }
}
