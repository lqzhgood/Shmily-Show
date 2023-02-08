const fs = require('fs-extra');
const path = require('path');
const DIR_SLICE = path.join(process.cwd(), '/public/json/slice/');
const { MSG_SLICE } = require('../../src/common');
fs.mkdirpSync(DIR_SLICE);

const { FILE_OUTPUT_JSON_MSG, FILE_OUTPUT_COMMENTS } = require('../config.js');

const JSON_MSG = fs.readJsonSync(FILE_OUTPUT_JSON_MSG);
const JSON_COMMENTS = fs.readJSONSync(FILE_OUTPUT_COMMENTS);

const JSON_MSG_SLICE = MSG_SLICE ? slice(JSON_MSG) : JSON_MSG;
const JSON_COMMENTS_SLICE = MSG_SLICE ? slice(JSON_COMMENTS) : JSON_COMMENTS;

// 写文件集中在一起  避免 webpack 多次 watch
fs.writeFileSync(path.join(DIR_SLICE, 'msg.json'), JSON.stringify(JSON_MSG_SLICE, null, 4));
fs.writeFileSync(path.join(DIR_SLICE, 'comments.json'), JSON.stringify(JSON_COMMENTS_SLICE, null, 4));

// 切割多少设置 src\utils\common.js 文件
function slice(arr, s = MSG_SLICE.S, e = MSG_SLICE.E) {
    // return arr.slice(s, e);
    return arr;
}
