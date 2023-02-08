const fs = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');

const { DIR_INPUT_MSG } = require('../../config');

const { getJSON, setJSON, md5 } = require('../../utils/index');

const jsonFiles = fs.readdirSync(DIR_INPUT_MSG);

for (let i = 0; i < jsonFiles.length; i++) {
    const f = jsonFiles[i];
    if (!/\.json$/.test(f)) continue;
    const jsonFilePath = path.join(DIR_INPUT_MSG, f);
    const json = getJSON(jsonFilePath);
    checkMs(json);
    giveID(f, json);
    setJSON(jsonFilePath, json);
    // fs.writeFileSync(jf, JSON.stringify(json, null, 4));
}

function checkMs(arr) {
    for (let i = 1; i < arr.length; i++) {
        const lMsg = arr[i - 1];
        const cMsg = arr[i];
        if (lMsg > cMsg) throw new Error('前面时间大于后面时间');
    }
}

function giveID(f, arr) {
    const UniqueObject = Object.create(null);
    // id = flag _ count
    const FORMAT_TIME_URL = 'YYYY-MM-DD_HH-mm-ss';
    arr.forEach((v, i) => {
        const { direction } = v;
        if (!['c', 'g'].includes(direction[0])) {
            console.log('❌', 'direction', direction);
            throw new Error('没有 direction');
        }
        const urlDay = dayjs(v.ms).format(FORMAT_TIME_URL);
        const currFlag = `${urlDay}_${direction[0]}_${md5(v.html, 6)}`;

        if (!UniqueObject[currFlag]) {
            UniqueObject[currFlag] = 0;
        }

        UniqueObject[currFlag]++;
        // 给ID
        v.id = `${f}_${currFlag}_${UniqueObject[currFlag]}`;
    });

    const similarId = arr.length - Object.keys(UniqueObject).length;
    if (similarId !== 0) console.log('⚠️', f, '相同 内容和时间 的消息数量', similarId);
}
