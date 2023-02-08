// NODE 环境也会用到 使用 require 模块

// 各种类型的 type 在 src\components\Msg\source\${Source}\types.js 下

const _ = require('lodash');

module.exports.isWechat = function (msg) {
    return msg.source === 'Wechat';
};
module.exports.isQQ = function (msg) {
    return msg.source === 'QQ';
};
module.exports.isMobileQQ_Android = function (msg) {
    return msg.source === 'MobileQQ' && _.get(msg, '$MobileQQ.os') === 'Android';
};
module.exports.isMobileQQ_s60v3 = function (msg) {
    return msg.source === 'MobileQQ' && _.get(msg, '$MobileQQ.os') === 's60v3';
};
module.exports.isSMS = function (msg) {
    return msg.source === 'SMS';
};
module.exports.isCallLog = function (msg) {
    return msg.source === 'CallLog';
};
module.exports.isCamera = function (msg) {
    return msg.source === 'Camera';
};
module.exports.isEmail = function (msg) {
    return msg.source === 'Email';
};
