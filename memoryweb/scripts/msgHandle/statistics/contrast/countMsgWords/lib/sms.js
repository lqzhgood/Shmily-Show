const { countWordByHtml } = require('../utils.js');

function sms(m) {
    return countWordByHtml(m.html);
}
module.exports = {
    sms,
};
