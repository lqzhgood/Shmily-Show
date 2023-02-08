const { plain } = require('./plain');
const { copy } = require('../utils.js');

const { Email_type_附件 } = require('../../../src/components/Msg/source/Email/types.js');

function email(m) {
    if (m.type === Email_type_附件) {
        const files = m.$Email.attachments;

        for (let i = 0; i < files.length; i++) {
            const f = files[i];
            const { url } = f;
            copy(m, url);
        }
    }

    console.log('Email 附件内容已归档, html 内容请手动归档', m.ms);
    // email html 里面太多背景等无关因素了，而且又不好排除，所以暂时不归档
    // plain(m);
}

module.exports = { email };
