const { countWordByHtml } = require('../utils.js');

function email(m) {
    return countWordByHtml(m.html);
}
module.exports = {
    email,
};
