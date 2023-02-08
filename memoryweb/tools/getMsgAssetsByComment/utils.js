const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const { ASSETS_DIR, TARGET_DIR, IGNORE_DIR } = require('./config');
function copy(msg, dataFile, options = {}) {
    if (!dataFile) return;

    // 文件名 decodeURIComponent 还原真实文件名
    // const filePiece = dataFile.split('/');
    // filePiece.push(decodeURIComponent(filePiece.pop()));
    // dataFile = filePiece.join('/');

    dataFile = decodeURIComponent(dataFile);

    if (IGNORE_DIR.find(v => dataFile.includes(v))) return;

    const { base } = path.parse(dataFile);
    const targetFile = `${dayjs(msg.ms).format('YYYY-MM-DD HH-mm-ss')} ${msg.source} ${base}`;
    // const targetFile = base;

    const o = path.join(ASSETS_DIR, dataFile);
    const t = path.join(TARGET_DIR, targetFile);

    if (fs.existsSync(o)) {
        fs.copyFileSync(o, t);
    } else {
        if (!options?.unLog) console.log('文件不存在', o);
    }
}

module.exports = {
    copy,
};
