const { msgArr: mArr, commentArr: cArr, SEARCH_KEY, SEARCH_FIELD } = require('./config.js');
const { copyMsgAssets, copyCommentAssets } = require('./lib/index.js');

if (cArr.length !== mArr.length) {
    console.log('comment and msg length not equal');
    process.exit(1);
}

// 全部资源
// mArr.forEach(m => {
//     copyMsgAssets(m);
// });

for (let i = 0; i < cArr.length; i++) {
    const c = cArr[i];
    // 找到 comment 头部
    if (!c || !c[SEARCH_FIELD]) continue;
    // 排除不符合条件的 comment 头部
    if (!c[SEARCH_FIELD].includes(SEARCH_KEY)) continue;

    const msgPiece = mArr.slice(c.msgIndex, c.msgIndexEnd + 1);
    msgPiece.forEach(m => {
        copyMsgAssets(m);
    });

    copyCommentAssets(c, msgPiece[0]);
}
