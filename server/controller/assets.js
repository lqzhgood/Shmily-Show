const fs = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');

const { EXT_VIDEO } = require('../utils/const');

const { DIR_MSG_DATA, ASSETS_COPY_TARGET } = require('../config.js');

exports.copy = (req, res, next) => {
    const { src, dir, msg } = req.body;

    const sf = path.join(DIR_MSG_DATA, src);

    if (!fs.existsSync(sf)) throw new Error('文件不存在');
    const targetTimeStr = dayjs(msg.ms).format('YYYY-MM-DD HH-mm-ss');
    const targetFileName = path.basename(sf);
    const destName = targetFileName.startsWith(targetTimeStr)
        ? targetFileName
        : `${dayjs(msg.ms).format('YYYY-MM-DD HH-mm-ss')} ${path.basename(sf)}`;

    const dest = path.join(ASSETS_COPY_TARGET, dir, destName);
    fs.copySync(sf, dest, { preserveTimestamps: true });

    res.send({
        code: 200,
        msg: 'ok',
        result: {},
    });
};

exports.getFolderFiles = (req, res, next) => {
    const { sDir, tDir } = req.mid.map;
    const { fileName } = req.params;
    const p = path.join(DIR_MSG_DATA, 'data', sDir, tDir);
    const files = (fs.existsSync(p) ? fs.readdirSync(p) : []).filter(v => v.includes(fileName));

    // 视频文件排在前面
    files.sort((a, b) => (EXT_VIDEO.includes('.' + a.split('.').pop().toLowerCase()) ? -1 : 1));

    res.json({
        code: 200,
        msg: '',
        result: files,
    });
};
