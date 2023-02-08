const fs = require('fs-extra');
const path = require('path');
const amrConvert = require('../lib/convertAmr/index.js');

const { ASSETS_TARGET } = require('../config');
const { getExtByBuff, getUrlString, findByFaceArr } = require('./index');
const { modifyImgMsg } = require('./qq-pc');

exports.modifyMsgByFile = async function ({ mSource, mType }, map, file, msg, filePath, lastModified) {
    const { sDir, tDir } = map;
    let accurateFix = false;

    // 计算正确后缀名
    const { name: oName, ext: _ext } = path.parse(file.originalname);
    const ext = (await getExtByBuff(file.buffer)) || _ext.toLowerCase();

    // 计算md5作为文件名
    const fileName = `${msg.ms}_${oName}`;
    const fileBase = `${fileName}${ext}`;

    // 文件路径
    const target = path.join(ASSETS_TARGET, sDir, tDir, 'manual');
    const targetFile = path.join(target, fileBase);

    // 文件备份路径(文件路径下的bak目录)
    const targetBak = path.join(ASSETS_TARGET, sDir, tDir, 'bak');
    const targetBakFile = path.join(targetBak, fileBase);

    // 创建备份目录
    fs.mkdirpSync(target);
    fs.mkdirpSync(targetBak);

    // 如果有指定文件路径则从文件路径复制文件,这样会保留文件的原始时间等信息
    if (filePath && fs.existsSync(path.join(filePath, file.originalname))) {
        fs.copyFileSync(path.join(filePath, file.originalname), targetBakFile);
    } else {
        // 如果没有的话从 buffer 写入文件, 有修改时间的话写入修改时间
        fs.writeFileSync(targetBakFile, file.buffer);
        if (lastModified) {
            fs.utimesSync(targetBakFile, new Date(lastModified), new Date(lastModified));
        }
    }

    let url;

    const S_T = `${mSource}_${mType}`;
    switch (S_T) {
        case `QQ_语音`: {
            msg.type = mType; // mType = 语音
            if (ext === '.amr') {
                // 保留备份的原始文件
                await amrConvert(targetBakFile, target, fileName);
                url = getUrlString(sDir, tDir, 'manual', `${fileName}.mp3`);
            } else {
                fs.moveSync(targetBakFile, targetFile);
                url = getUrlString(sDir, tDir, 'manual', fileBase);
            }
            if (['语音消息', '语音消息回复'].includes(msg.content)) {
                msg.content = '[语音消息]';
                msg.html = `<audio controls src="${url}" ></audio>`;
            } else {
                msg.content += '[语音消息]';
                msg.html += `<audio controls src="${url}" ></audio>`;
            }
            break;
        }

        case 'QQ_表情': {
            throw new Error('前端额外处理');
        }

        case 'QQ_图片': {
            msg.type = mType; // mType = 图片
            // 默认处理方式
            fs.moveSync(targetBakFile, targetFile);
            url = getUrlString(sDir, tDir, 'manual', fileBase);

            const content = '[图]';
            const html = `<img src="${url}" />`;
            const res = modifyImgMsg(msg, content, html);
            accurateFix = res.accurateFix;

            break;
        }

        case 'QQ_视频': {
            msg.type = mType; // mType = 视频
            // 默认处理方式
            fs.moveSync(targetBakFile, targetFile);
            url = getUrlString(sDir, tDir, 'manual', fileBase);

            const content = '[视频]';
            const html = `<video controls src="${url}" ></video>`;
            const res = modifyImgMsg(msg, content, html);
            accurateFix = res.accurateFix;

            break;
        }

        default: {
            const eTxt = `未定义 modify, 请在前后端分别为 ${S_T} 定义执行方法`;
            throw new Error(eTxt);
        }
    }
    return { msg, url, accurateFix };
};

exports.hasFace = function (md5, sDir, tDir, buffer) {
    const target = path.join(ASSETS_TARGET, sDir, tDir);
    const faceArr = fs.readJsonSync(path.join(target, 'emojiMapByQQ.json'));
    return findByFaceArr(md5, faceArr);
};
