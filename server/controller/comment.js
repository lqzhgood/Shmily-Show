const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const dayjs = require('dayjs');

const makePreMsg = require('../lib/makePreMsg');
const { getJSON, openFolder, htmlCover } = require('../utils/index');
const { DIR_WEB, FILE_INPUT_COMMENT, COMMENTS_TARGET } = require('../config');

exports.add = function (req, res, next) {
    const { sId, sMs, eId, eMs, html } = req.body;
    const comments = getJSON(FILE_INPUT_COMMENT) || [];

    const f = comments.find(v => v.sId === sId);
    if (f) {
        res.json({
            code: 500,
            msg: '重复',
            result: f,
        });
        return;
    }
    const t = Date.now();

    comments.push({
        sId,
        sMs,
        eId,
        eMs,
        html: htmlCover(html),
        ms: t,
        time: dayjs(t).format('YYYY-MM-DD HH:mm:ss'),
    });
    const sort_comments = _.sortBy(comments, 'sMs');
    fs.writeFileSync(FILE_INPUT_COMMENT, JSON.stringify(sort_comments, null, 4));

    const reMsg = makePreMsg();

    res.json({
        code: 200,
        msg: reMsg,
        result: reMsg,
    });
};

exports.modify = function (req, res, next) {
    const { sId, comment, newHtml } = req.body;
    const comments = getJSON(FILE_INPUT_COMMENT) || [];

    const fIndex = comments.findIndex(v => v.sId === sId);
    const f = comments[fIndex];
    if (!f) throw new Error(`没有找到相关消息`);

    if (f.html != comment.html) throw new Error(`ID消息和HTML评论不对应`);

    f.html = htmlCover(newHtml);
    f.ms = Date.now();

    fs.writeFileSync(FILE_INPUT_COMMENT, JSON.stringify(comments, null, 4));

    const reMsg = makePreMsg();

    res.json({
        code: 200,
        msg: reMsg,
        result: reMsg,
    });
};

exports.delete = function (req, res, next) {
    const { sId, comment } = req.body;
    const comments = getJSON(FILE_INPUT_COMMENT) || [];

    const fIndex = comments.findIndex(v => v.sId === sId);
    const f = comments[fIndex];
    if (!f) throw new Error(`没有找到相关消息`);

    if (f.html != comment.html) throw new Error(`ID消息和HTML评论不对应`);

    comments.splice(fIndex, 1);

    fs.writeFileSync(FILE_INPUT_COMMENT, JSON.stringify(comments, null, 4));

    const reMsg = makePreMsg();

    res.json({
        code: 200,
        msg: reMsg,
        result: reMsg,
    });
};

exports.createFolder = function (req, res) {
    const { id } = req.query;
    const p = path.join(COMMENTS_TARGET, id);

    openFolder(p, COMMENTS_TARGET);
    res.json({
        code: 200,
        msg: '',
        result: '',
    });
};

exports.getFolderFiles = function (req, res) {
    const { id } = req.query;
    if (!id) throw new Error('need id');
    const p = path.join(COMMENTS_TARGET, id);
    const files = fs.existsSync(p) ? fs.readdirSync(p) : [];
    res.json({
        code: 200,
        msg: '',
        result: files,
    });
};
