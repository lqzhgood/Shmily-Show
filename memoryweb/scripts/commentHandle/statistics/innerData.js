// 存一些 web 内部使用的数据,这些数据会 import 打包在一起,不通过 ajax 请求

const fs = require('fs-extra');
const path = require('path');

const { DIR_OUTPUT_IMPORT_STATISTIC } = require('../../config');

const { ALL_YEAR } = require('./const.js');

// !!! import 路径没法使用变量 所以这里硬编码
const outDir = path.join(DIR_OUTPUT_IMPORT_STATISTIC, `./Edit/`);
fs.mkdirpSync(outDir);

fs.writeFileSync(path.join(outDir, `ALL_YEAR.json`), JSON.stringify(ALL_YEAR, null, 4));
