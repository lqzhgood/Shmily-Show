const _ = require('lodash');
const path = require('path');

const { FILE_INPUT_COMMENTS, FILE_OUTPUT_COMMENTS, FILE_OUTPUT_JSON_MSG, DIR_WEB_CODE } = require('../../config');

const { COMMENT_TYPE_HEADER, COMMENT_TYPE_CONTENT, COMMENT_TYPE_FOOTER } = require(path.join(
    DIR_WEB_CODE,
    './components/Comment/const.js',
));

const { getJSON, setJSON } = require('../../utils/index');
const { MSG_SLICE } = require('../../../src/common');
const { htmlToText } = require('../utils.js');

const msgAll = getJSON(FILE_OUTPUT_JSON_MSG);
const cArr = new Array(msgAll.length);

const _commentsAll = getJSON(FILE_INPUT_COMMENTS);
let commentsAll = _.sortBy(_commentsAll, 'sMs');

// eslint-disable-next-line
if (commentsAll.length === 0) return;

if (MSG_SLICE) {
    commentsAll = commentsAll.filter(({ sMs, eMs }) => sMs >= _.head(msgAll).ms && eMs <= _.last(msgAll).ms);
    console.log('✔️', `匹配到 comments 数据 ${commentsAll.length} 条`);
}

let index = 0;

for (let i = 0; i < msgAll.length; i++) {
    const msg = msgAll[i];
    // 找到当前 消息 位置的 评论
    const cIndex = commentsAll.findIndex(c => c.sId === msg.id);
    if (cIndex === -1) continue;

    // 和当前消息匹配的 评论
    const c = commentsAll.splice(cIndex, 1)[0];
    const ceI = msgAll.findIndex(m => m.id === c.eId);
    if (ceI === -1) {
        console.warn('❌', `评论结束ID 未找到`, c.eId);
        throw new Error();
    }

    const csI = i;
    if (csI > ceI) throw new Error(`起始ID 大于 结束ID`);

    let num = 0;
    while (csI + num <= ceI) {
        if (cArr[i + num]) throw new Error('评论重叠');

        cArr[i + num] = {
            type: [COMMENT_TYPE_CONTENT],
        };

        const currC = cArr[i + num];

        if (csI + num === csI) {
            currC.type.push(COMMENT_TYPE_HEADER);
            currC.html = c.html;
            currC.content = htmlToText(c.html); //用于搜索和分析
            currC.ms = c.ms;
            currC.time = c.time;
            currC.index = index; // 第几条评论
            currC.msgId = msg.id; // 搜索时后用来快速定位消息用
            currC.msgIndex = csI; // 第几条消息的评论
            currC.msgIndexEnd = ceI;
            currC.length = ceI - csI + 1; // 评论长度 (评论占据几条消息长度)
            index++;
        }

        // 最后一个打上 footer 标记
        if (csI + num === ceI) {
            currC.type.push(COMMENT_TYPE_FOOTER);
        }

        num++;
    }

    if (commentsAll.length === 0) break;
}

if (commentsAll.length !== 0) {
    console.log(commentsAll);
    throw new Error(`有评论无 msgId 记录 ${commentsAll.length}`);
}

// fs.writeFileSync(FILE_OUTPUT_COMMENTS, JSON.stringify(cArr, null, 4));
setJSON(FILE_OUTPUT_COMMENTS, cArr);
