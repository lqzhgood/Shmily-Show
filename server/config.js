const path = require('path');

const DIR_WEB = path.join(__dirname, '../memoryweb');
const DIR_MSG_DATA = path.join(__dirname, '../msgData');

module.exports = {
    DIR_WEB,
    DIR_MSG_DATA,
    // src
    FILE_INPUT_MSG_MODIFY: path.join(DIR_WEB, '/src/assets/data/modify.json'),
    FILE_INPUT_COMMENT: path.join(DIR_WEB, '/src/assets/data/comments.json'),
    DIR_INPUT_MSG: path.join(DIR_WEB, '/src/assets/data/msg'),
    // public
    FILE_INPUT_MSG: path.join(DIR_WEB, '/public/json/msg/msg.json'),
    FILE_INPUT_MSG_ORIGINAL: path.join(DIR_WEB, '/public/json/msg/msg_original.json'),

    ASSETS_TARGET: path.join(DIR_MSG_DATA, 'data'),
    ASSETS_COPY_TARGET: path.join(DIR_MSG_DATA, 'copy'),
    COMMENTS_TARGET: path.join(DIR_MSG_DATA, './data/comments'),
};
