const fs = require('fs-extra');
const path = require('path');
const exec = require('child_process').execSync;
const { md5ByBuffer, getExtByBuff } = require('../utils/index');
const { ASSETS_TARGET } = require('../config');

function mergerFace(sDir, tDir) {
    return exec('node merger.js', {
        cwd: path.join(ASSETS_TARGET, sDir, tDir),
    }).toString();
}

async function faceAliasAdd(sDir, tDir, unknownFace, aliasFiles) {
    const { type, alt } = unknownFace;
    const currTypeFaceAliasArrDir = path.join(ASSETS_TARGET, sDir, tDir, type, 'alias');

    fs.mkdirpSync(currTypeFaceAliasArrDir);
    const filesInfo = [];
    for (let i = 0; i < aliasFiles.length; i++) {
        const file = aliasFiles[i];
        const md5 = md5ByBuffer(file.buffer);
        let ext = await getExtByBuff(file.buffer);
        if (!ext) ext = path.extname(file.originalname);
        const fileInfo = {
            md5,
            ext,
            size: file.size,
        };
        filesInfo.push(fileInfo);
        const faceFile = path.join(currTypeFaceAliasArrDir, `${fileInfo.md5}${fileInfo.ext}`);
        fs.writeFileSync(faceFile, file.buffer);
    }
    return filesInfo;
}

module.exports = {
    mergerFace,
    faceAliasAdd,
};
