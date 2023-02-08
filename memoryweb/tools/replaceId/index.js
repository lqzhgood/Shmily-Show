const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const { md5 } = require('../../scripts/utils/index');

// old
let o = require('./o');
// new
let n = require('./n');

if (n.length != o.length) console.warn('❌', 'Length not same');

// 单个文件
// const fileNameInId = 'msg-qq_s60.json';
// console.log('fileNameInId', fileNameInId);
// giveID(fileNameInId, o);
// giveID(fileNameInId, n);

const idMap = [];

for (let i = 0; i < n.length; i++) {
    const _n = n[i];
    const _o = o[i];
    if (_n.id !== _o.id) {
        idMap.push({
            n: _n.id,
            o: _o.id,
        });
    }
}

fs.writeFileSync('./idMap.json', JSON.stringify(idMap, null, 4));

fs.readdirSync('./input/').forEach(_f => {
    const f = `./input/${_f}`;
    let txt = fs.readFileSync(f, 'utf-8');
    idMap.forEach(m => {
        txt = txt.replace(new RegExp(m.o, 'gm'), m.n);
    });

    fs.writeFileSync(`./dist/${_f}`, txt);
});

// 处理 commit文件夹
console.log('Dir');
const COMMIT_DIR = path.join(__dirname, '../../../msgData/data/comments/');
const commitDirs = fs.readdirSync(COMMIT_DIR).filter(d => d !== 'face');
for (let i = 0; i < commitDirs.length; i++) {
    const oldId = commitDirs[i];
    const f = idMap.find(v => v.o === oldId);
    if (!f) {
        console.log(i, oldId);
        throw new Error('not found');
    }
    fs.renameSync(path.join(COMMIT_DIR, oldId), path.join(COMMIT_DIR, f.n));
}

function giveID(f, arr) {
    const UniqueObject = Object.create(null);
    // id = flag _ count
    const FORMAT_TIME_URL = 'YYYY-MM-DD_HH-mm-ss';
    arr.forEach((v, i) => {
        const urlDay = dayjs(v.ms).format(FORMAT_TIME_URL);
        const currFlag = `${urlDay}_${md5(v.html).slice(0, 6)}`;

        if (!UniqueObject[currFlag]) {
            UniqueObject[currFlag] = 0;
        }

        UniqueObject[currFlag]++;
        // 给ID
        v.id = `${f}_${currFlag}_${UniqueObject[currFlag]}`;
    });

    console.log('⚠️', f, '相同 内容和时间 的消息数量', arr.length - Object.keys(UniqueObject).length);
}
