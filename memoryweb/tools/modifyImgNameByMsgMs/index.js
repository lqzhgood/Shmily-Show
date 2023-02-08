const fs = require('fs');
const path = require('path');

const mDir = '../../../msgData/data/qq-pc/img/manual/';
const mList = fs.readdirSync(mDir);

const mData = require('../../../memoryweb/src/assets/data/modify.json');

const mMap = mData.reduce((pre, cV) => {
    if (cV.type !== 'modify') return pre;

    const { nMsg } = cV;

    const f = mList.find(v => nMsg.html.includes(encodeURIComponent(v)));

    if (!f) return pre;

    pre.push({
        nMsg,
        f,
        nf: f.replace(/^\d{13,13}_/, nMsg.ms + '_'),
    });

    return pre;
}, []);

// console.log('mMap', mMap);
console.log('mMap.length===mList.length', mMap.length, mList.length);

const s = mList.filter(v => !mMap.find(v2 => v2.f === v));
console.log('s', s);

const filterUnique = arr => arr.filter(i => arr.indexOf(i) !== arr.lastIndexOf(i));
console.log('', filterUnique(mMap.map(v => v.f)));

let text = fs.readFileSync('../../../memoryweb/src/assets/data/modify.json', 'utf-8');
for (let i = 0; i < mMap.length; i++) {
    const { f, nf } = mMap[i];
    text = text.replaceAll(encodeURIComponent(f), encodeURIComponent(nf));

    if (fs.existsSync(path.resolve(mDir, f))) {
        fs.renameSync(path.join(mDir, f), path.join(mDir, nf));
    } else {
        console.log('f', f);
    }
}

fs.writeFileSync('./1.json', text);
