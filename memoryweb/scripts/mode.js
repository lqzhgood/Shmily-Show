const fs = require('fs-extra');
const path = require('path');

const { FILE_INPUT_COMMENTS, DIR_INPUT_IMPORT, FILE_INPUT_MSG_MODIFY } = require('./config.js');
const { getJSON } = require('./utils/index');

const mode = ['msg'];

const _commentsAll = getJSON(FILE_INPUT_COMMENTS);
if (_commentsAll.length !== 0) mode.push('comment');

const _modifyJson = getJSON(FILE_INPUT_MSG_MODIFY);
if (_modifyJson.length !== 0) mode.push('modify');

fs.writeFileSync(path.join(DIR_INPUT_IMPORT, './mode.json'), JSON.stringify(mode));
