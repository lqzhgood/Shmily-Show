const { plain } = require('./plain');

function sms(m) {
    plain(m);
}

module.exports = { sms };
