const fs = require('fs-extra');
const path = require('path');

const { GROUP_RECEIVE, GROUP_SEND } = require('./user/userGroup.js');

// /src
const DIR_WEB_CODE = path.join(process.cwd(), './src');

// /src/assets/data/  --> 原始文件
const DIR_INPUT = path.join(process.cwd(), './src/assets/data/');
const DIR_INPUT_MSG = path.join(DIR_INPUT, './msg/');

const FILE_INPUT_MSG_MODIFY = path.join(DIR_INPUT, './modify.json');

// /src/assets/data_pre/  --> import 导入
const DIR_INPUT_IMPORT = path.join(process.cwd(), './src/assets/data_pre/');
const DIR_OUTPUT_IMPORT_MSG = path.join(DIR_INPUT_IMPORT, './msg/');
const DIR_OUTPUT_IMPORT_STATISTIC = path.join(DIR_INPUT_IMPORT, './statistic/');

// ../msgData
//  存放 msg data 的静态文件 也就是被 nginx 反代的目录
//  最终会和 本项目 public 合并
const DIR_OUTPUT_MSG_DATA_STATIC = path.join(process.cwd(), '../msgData/');
const DIR_OUTPUT_COMMENT_STATIC = path.join(
    DIR_OUTPUT_MSG_DATA_STATIC,
    './data/comments/'
);
if (!fs.existsSync(DIR_OUTPUT_COMMENT_STATIC)) {
    fs.mkdirpSync(DIR_OUTPUT_COMMENT_STATIC);
}

// web程序需要的一些静态文件  非 msg data
const DIR_OUTPUT_PUBLIC = path.join(process.cwd(), './public/');
// 静态文件
const DIR_OUTPUT_PUBLIC_STATIC = path.join(DIR_OUTPUT_PUBLIC, './static/');
// /public/json --> ajax 导入
const DIR_OUTPUT_PUBLIC_JSON = path.join(DIR_OUTPUT_PUBLIC, './json/');

// /public/json/msg
const DIR_OUTPUT_PUBLIC_JSON_MSG = path.join(DIR_OUTPUT_PUBLIC_JSON, './msg/');
const FILE_OUTPUT_JSON_MSG = path.join(
    DIR_OUTPUT_PUBLIC_JSON_MSG,
    './msg.json'
);
const FILE_OUTPUT_JSON_MSG_ORIGINAL = path.join(
    DIR_OUTPUT_PUBLIC_JSON_MSG,
    './msg_original.json'
);

// /public/json/statistic
const DIR_OUTPUT_PUBLIC_JSON_STATISTIC = path.join(
    DIR_OUTPUT_PUBLIC_JSON,
    './statistic/'
);

// comment
const DIR_INPUT_COMMENT = path.join(process.cwd(), './src/assets/data/');
const FILE_INPUT_COMMENTS = path.join(DIR_INPUT_COMMENT, 'comments.json');

const DIR_OUTPUT_COMMENT = path.join(DIR_OUTPUT_PUBLIC_JSON, './comment/');
const FILE_OUTPUT_COMMENTS = path.join(DIR_OUTPUT_COMMENT, 'comments.json');

fs.mkdirpSync(DIR_OUTPUT_COMMENT);

module.exports = {
    DIR_WEB_CODE,
    DIR_INPUT,
    DIR_INPUT_MSG,
    FILE_INPUT_MSG_MODIFY,
    DIR_INPUT_IMPORT,
    DIR_OUTPUT_IMPORT_MSG,
    DIR_OUTPUT_IMPORT_STATISTIC,
    DIR_OUTPUT_MSG_DATA_STATIC,
    DIR_OUTPUT_PUBLIC,
    DIR_OUTPUT_PUBLIC_STATIC,
    DIR_OUTPUT_PUBLIC_JSON,
    DIR_OUTPUT_PUBLIC_JSON_MSG,
    FILE_OUTPUT_JSON_MSG,
    FILE_OUTPUT_JSON_MSG_ORIGINAL,
    DIR_OUTPUT_PUBLIC_JSON_STATISTIC,
    DIR_OUTPUT_COMMENT_STATIC,

    // comment
    DIR_INPUT_COMMENT,
    FILE_INPUT_COMMENTS,
    DIR_OUTPUT_COMMENT,
    FILE_OUTPUT_COMMENTS,

    GROUP_SEND,
    GROUP_RECEIVE,
};
