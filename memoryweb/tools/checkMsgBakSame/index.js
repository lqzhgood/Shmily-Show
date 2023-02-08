const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const msgOriginalDir = path.join(__dirname, '../../src/assets/data/msg/');
const msgOriginalDiffDir = path.join(__dirname, '../../src/assets/data/msg/bak/');

fs.readdirSync(msgOriginalDir).forEach(_f => {
    const f = path.join(msgOriginalDir, _f);
    if (fs.statSync(f).isDirectory()) return;
    const fDiff = path.join(msgOriginalDiffDir, _f);

    const fJson = readJson(f).map(v => {
        delete v.id;
        delete v.index;
        delete v.msAccuracy;

        // delete v.device;
        // delete v.sender;
        // delete v.senderName;
        // delete v.receiver;
        // delete v.receiverName;

        return v;
    });
    const fDiffJson = readJson(fDiff).map(v => {
        delete v.id;
        delete v.index;
        delete v.msAccuracy;

        // delete v.device;
        // delete v.sender;
        // delete v.senderName;
        // delete v.receiver;
        // delete v.receiverName;

        return v;
    });

    const x = _.isEqual(fJson, fDiffJson);

    if (!x) {
        console.log('f', f);
    }
});

function readJson(p) {
    return JSON.parse(fs.readFileSync(p));
}
