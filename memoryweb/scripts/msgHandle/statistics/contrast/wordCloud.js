const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const nodejieba = require('nodejieba');
const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC, DIR_WEB_CODE } = require('../../../config');

const { MATCH_EMOTION_ALT } = require(path.join(DIR_WEB_CODE, './common.js'));

const { REG: BAN_REG, WORDS: BAN_WORDS } = require('../../../user/banDict.js');
const {
    SOURCE_TYPE_CONTRAST,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
} = require('../../../../src/views/Statistic/const.js');

const { msgJsonAll } = require('../const.js');

// 载入所有词典
nodejieba.load({
    userDict: path.join(__dirname, '../../../user/userDict.txt'),
});
const outDir = path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_CONTRAST}/`);

const msgAll = msgJsonAll.filter(m => m.content && m.content.trim());
const WORDS_ALL = makeWords(msgAll.map(m => m.content));
const allDir = path.join(outDir, `/${DIRECTION_TYPE_ALL}/`);
fs.mkdirpSync(allDir);
fs.writeFileSync(path.join(allDir, 'wordCloud.json'), JSON.stringify(WORDS_ALL, null, 4));

const WORDS_COME = makeWords(msgAll.filter(m => m.direction === 'come').map(m => m.content));
const comeDir = path.join(outDir, `/${DIRECTION_TYPE_COME}/`);
fs.mkdirpSync(comeDir);
fs.writeFileSync(path.join(comeDir, 'wordCloud.json'), JSON.stringify(WORDS_COME, null, 4));

const WORDS_GO = makeWords(msgAll.filter(m => m.direction === 'go').map(m => m.content));
const goDir = path.join(outDir, `/${DIRECTION_TYPE_GO}/`);
fs.mkdirpSync(goDir);
fs.writeFileSync(path.join(goDir, 'wordCloud.json'), JSON.stringify(WORDS_GO, null, 4));

function makeWords(arr) {
    if (arr.length === 0) return [];
    let words = Object.create(null);
    for (let i = 0; i < arr.length; i++) {
        const t = clipContent(arr[i]);
        const wArr = clipWords(nodejieba.cut(t, true));
        for (let j = 0; j < wArr.length; j++) {
            const w = wArr[j];
            if (!words[w]) {
                words[w] = 0;
            }
            words[w]++;
        }
    }
    words = _.orderBy(
        Object.entries(words).map(([w, n]) => ({ w, n })),
        'n',
        'desc',
    );

    if (words[0]) words[0].i = 1;

    for (let i = 1; i < words.length; i++) {
        const wl = words[i - 1];
        const wh = words[i];

        if (wh.n === wl.n) {
            wh.i = wl.i;
        } else {
            wh.i = wl.i + 1;
        }
    }

    return words;
}

function clipContent(s) {
    return (
        s
            // 去掉表情包 [{packName}-{des}]  假设 packName 和 des 范围在 1-20 个字之间
            .replaceAll(MATCH_EMOTION_ALT, ' ')
    );
}

function clipWords(ws) {
    const reg = BAN_REG;
    const words = BAN_WORDS;
    return ws.filter(s => s && !reg.some(r => r.test(s)) && !words.includes(s));
}
