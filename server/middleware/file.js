const DICT_SOURCE_DIR = require('../DICT_SOURCE_DIR');

exports.sourceFileMap = function (req, res, next) {
    if (req.body.formData) {
        req.body = JSON.parse(req.body.formData);
    }

    const source = req.query.source || req.body.source;
    const type = req.query.type || req.body.type;

    if (!source || !type) throw new Error('not have source and type');
    const map = DICT_SOURCE_DIR.find(v => v.source === source && v.type === type);
    if (!map) {
        res.send({
            code: 500,
            msg: '路径字典未定义，请在 Server / DICT_SOURCE_DIR.js 中定义路径',
            result: '',
        });
    } else {
        if (!req.mid) req.mid = {};
        req.mid.map = map;
        next();
    }
};
