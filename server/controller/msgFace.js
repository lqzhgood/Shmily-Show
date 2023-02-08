const fs = require('fs-extra');
const path = require('path');
const { ASSETS_TARGET } = require('../config');

const { hasFace } = require('../utils/file');
const { modifyImgMsg } = require('../utils/qq-pc');
const { mergerFace, faceAliasAdd } = require('../service/face');

const { md5ByBuffer, getExtByBuff, openFolder } = require('../utils/index');

module.exports.mergerFace = function (req, res) {
    const map = req.mid.map;
    const { sDir, tDir } = map;

    const result = mergerFace(sDir, tDir);

    res.send({
        code: 200,
        msg: 'ok',
        result,
    });
};

exports.faceHas = async (req, res, next) => {
    const { file, body } = req;
    const { source, type, msg } = body;
    const map = req.mid.map;

    const { sDir, tDir } = map;
    const md5 = md5ByBuffer(file.buffer);

    const has = hasFace(md5, sDir, tDir, file.buffer);

    let result = {
        ...has,
        msg: null,
    };

    if (has.face) {
        const alt = `${has.face.type}-${has.face.alt}`;
        const html = `<img src="/data/${sDir}/${tDir}/${has.face.type}/${has.file.md5}${has.file.ext}" alt="${alt}" title="${alt}" />`;
        const content = `[${alt}]`;

        const { msg: msgModify, accurateFix } = modifyImgMsg(msg, content, html, has.face.alt);
        result.msg = msgModify;
        result.accurateFix = accurateFix;
    } else {
        let ext = await getExtByBuff(file.buffer);
        if (!ext) ext = path.extname(file.originalname);
        result.fileInfo = {
            md5,
            ext,
            size: file.size,
        };
    }

    res.send({
        code: 200,
        msg: 'ok',
        result,
    });
};

exports.faceMd5 = async (req, res) => {
    const { file, body } = req;

    let ext = await getExtByBuff(file.buffer);
    if (!ext) ext = path.extname(file.originalname);

    const md5 = md5ByBuffer(file.buffer);

    res.send({
        code: 200,
        msg: 'ok',
        result: {
            md5,
            ext,
            size: file.size,
        },
    });
};

exports.faceAdd = (req, res) => {
    const { file, body } = req;
    const { source, type, msg, unknownFace, fileInfo, alias } = body;
    const map = req.mid.map;

    const { sDir, tDir } = map;

    const currTypeFaceArrDir = path.join(ASSETS_TARGET, sDir, tDir, unknownFace.type);
    const currTypeFaceArrFile = path.join(currTypeFaceArrDir, '_faceArr.json');
    let currTypeFaceArr = [];
    if (fs.existsSync(currTypeFaceArrFile)) {
        currTypeFaceArr = fs.readJsonSync(currTypeFaceArrFile);
    }

    const sameAlt = currTypeFaceArr.find(v => v.alt === unknownFace.alt);
    if (sameAlt) {
        sameAlt.files.push({ ...fileInfo });
    } else {
        currTypeFaceArr.push({
            ...unknownFace,
            files: [fileInfo],
        });
    }
    fs.mkdirpSync(currTypeFaceArrDir);

    const faceFile = path.join(currTypeFaceArrDir, `${fileInfo.md5}${fileInfo.ext}`);
    fs.writeFileSync(faceFile, file.buffer);

    fs.writeFileSync(currTypeFaceArrFile, JSON.stringify(currTypeFaceArr, null, 4));

    mergerFace(sDir, tDir);

    const alt = `${unknownFace.type}-${unknownFace.alt}`;
    const html = `<img src="./data/${sDir}/${tDir}/${unknownFace.type}/${fileInfo.md5}${fileInfo.ext}" alt="${alt}" title="${alt}" />`;
    const content = `[${alt}]`;
    const { msg: msgModify, accurateFix } = modifyImgMsg(msg, content, html, unknownFace.alt);

    res.send({
        code: 200,
        msg: 'ok',
        result: { msg: msgModify, accurateFix },
    });
};

exports.faceAliasAdd = async (req, res) => {
    const { files, body } = req;
    const { unknownFace } = body;
    const map = req.mid.map;
    const { sDir, tDir } = map;

    const alias = await faceAliasAdd(sDir, tDir, unknownFace, files);

    res.send({
        code: 200,
        msg: 'ok',
        result: alias,
    });
};

exports.openFace = (req, res) => {
    const { faceType } = req.query;

    const map = req.mid.map;
    const { sDir, tDir } = map;

    const p = path.join(ASSETS_TARGET, sDir, tDir, faceType);
    openFolder(p, ASSETS_TARGET);
    res.send({
        code: 200,
        msg: 'ok',
        result: '',
    });
};

exports.getFaceArr = (req, res) => {
    const map = req.mid.map;
    const { sDir, tDir } = map;
    const target = path.join(ASSETS_TARGET, sDir, tDir);
    const faceArr = fs.readJsonSync(path.join(target, 'emojiMapByQQ.json'));
    res.send({
        code: 200,
        msg: 'ok',
        result: {
            baseUrl: `/data/${sDir}/${tDir}`,
            faceArr,
        },
    });
};

exports.getFaceTypeArr = (req, res) => {
    const { faceType } = req.params;

    const map = req.mid.map;
    const { sDir, tDir } = map;
    const target = path.join(ASSETS_TARGET, sDir, tDir, faceType, '_faceArr.json');
    res.send({
        code: 200,
        msg: 'ok',
        result: {
            faceTypeArr: fs.readJsonSync(target),
        },
    });
};
