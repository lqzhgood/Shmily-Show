const DICT_SOURCE_DIR = require('../DICT_SOURCE_DIR');
const { modifyMsgByFile } = require('../utils/file.js');

exports.modifyByFile = async (req, res, next) => {
    const { file, body } = req;
    const { source: mSource, type: mType, msg, filePath, lastModified } = body;

    const map = req.mid.map;
    const result = await modifyMsgByFile({ mSource, mType }, map, file, msg, filePath, lastModified);
    res.send({
        code: 200,
        msg: 'ok',
        result,
    });
};

exports.sourceDict = (req, res) => {
    res.send({
        code: 200,
        msg: 'ok',
        result: DICT_SOURCE_DIR,
    });
};
